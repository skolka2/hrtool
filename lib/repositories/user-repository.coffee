debug = require('debug') 'hrtool:user-repository'
parse = require 'csv-parse'
_ = require 'lodash-node'
async = require	'async'
Const = require '../constants'

module.exports = (dbClient) ->
	return {
		insertUser: (userData, next)->
			data1 = _.pick userData, ['first_name', 'last_name', 'email', 'is_hr', 'id_department_role', 'id_buddy']
			data1.started_at = new Date().toDateString()
			data2 = _.pick userData, ['is_admin', 'id_team']
			async.waterfall([
				(callback) ->
					title = if userData.is_admin then 'Team manager' else 'User'
					dbClient.queryOne "SELECT id_user_role FROM user_roles WHERE title=$1", [title], callback
				,
				(res, callback) ->
					data1.id_user_role = res.id_user_role
					dbClient.insertOne 'users', data1, callback
				,
				(res, callback) ->
					data2.id_user = res.id_user
					dbClient.insertOne 'users_teams', data2, callback
				], next)

		insertUsersFromCSV: (str, next) ->
			parse str, (err, rows)->
				return next(err, null) if err
				values = [];
				for row, i in rows
					values.push {
						first_name: row[0],
						last_name: row[1],
						email: row[2],
						started_at: row[3],
						id_user_role: row[4],
						id_department_role: row[5],
						id_buddy: row[6]
					}
			dbClient.insert 'users', values, next

		verifyUser: (email, done) ->
			dbClient.queryOne 'SELECT * FROM users WHERE email=$1', [email], done

		getAllUsers : (userIdRole, next) ->
			if userIdRole is Const.ADMINISTRATOR
					dbClient.queryAll """
						SELECT u.*,
							ARRAY(SELECT ut.id_team FROM users_teams ut WHERE u.id_user=ut.id_user) as teams
							FROM users u""", next
				else
					return next 'Not authorized to do that'

		getHR : (email, next)->
			dbClient.queryAll 'SELECT id_user, first_name,last_name FROM users WHERE is_hr ORDER BY last_name', next

		getAllUserTeams: (idUser, next) ->
			dbClient.queryAll "
				SELECT
					ut.is_admin,
					t.title AS team,
					t.id_team,
					d.title AS department,
					d.id_department
				FROM users_teams ut
				JOIN teams t ON t.id_team=ut.id_team
				JOIN departments d ON t.id_department=d.id_department
				WHERE ut.id_user=$1", [idUser], next

		getBasicUserInfo: (idUser, next) ->
			dbClient.queryOne """
				SELECT
					u.first_name,
					u.last_name,
					u.email,
					u.id_user_role,
					u2.id_user AS id_buddy,
					u2.last_name AS buddy_last_name,
					u2.first_name AS buddy_first_name
				FROM users u
				LEFT JOIN users u2 ON u.id_buddy = u2.id_user
				WHERE u.id_user=$1""", [idUser], next
		getAllUsersForTable : (queryData, userIdRole, next) ->
			i = 1;
			query = "SELECT DISTINCT sel.*
					FROM (
						SELECT
							u.id_user,
							CONCAT(u.last_name,', ',u.first_name) AS full_name,
							COUNT(CASE WHEN t.completed=true THEN 1 END) AS done,
							COUNT(CASE WHEN t.completed=false THEN 1 END) AS undone
						FROM tasks t
						RIGHT JOIN users u ON u.id_user=t.id_user
						GROUP BY u.id_user
					) AS sel";

			if queryData?
				params = [];
				if queryData.filterData?
					if queryData.filterData.input?
						query += " WHERE LOWER(sel.full_name) LIKE LOWER($#{i++})"
						params.push queryData.filterData.input
					else
						development = 0
						team = 1
						if queryData.filterData.filter[development]? and not queryData.filterData.filter[team]?
							query += " JOIN users_teams ut ON ut.id_user=sel.id_user
									   JOIN teams te ON ut.id_team=te.id_team
									   JOIN departments d ON te.id_department=$#{i++}"
							params.push queryData.filterData.filter[development]

						if queryData.filterData.filter[team]?
							query += " JOIN users_teams ut ON ut.id_user=sel.id_user
									   JOIN teams te ON ut.id_team=$#{i++}"
							params.push queryData.filterData.filter[team]
				params.push queryData.offset
				params.push queryData.limit
				query += " ORDER BY #{queryData.sortBy} #{queryData.sort_way} OFFSET $#{i++} LIMIT $#{i++}";
				dbClient.queryAll query, params, next
			else
				query += " ORDER BY full_name"
				dbClient.queryAll query, next


	}