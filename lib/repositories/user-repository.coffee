debug = require('debug') 'hrtool:user-repository'
parse = require 'csv-parse'
_ = require 'lodash-node'
async = require	'async'

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
			dbClient.queryAll "SELECT id_user_role FROM user_roles
								WHERE id_user_role=$1 AND (title='Administrator' OR title='Team manager')" , [userIdRole], (err, data) ->
				return next err if err
				if data.length > 0
					dbClient.queryAll """
						SELECT u.*,
							ut.id_team,
							t.id_department,
							CONCAT(u.last_name,', ',u.first_name) AS full_name,
							CONCAT(u.id_user, '-', ut.id_team) AS unique_id
					   FROM users u
					   JOIN users_teams ut ON u.id_user=ut.id_user
					   JOIN teams t ON ut.id_team=t.id_team""", next
				else
					return next 'Not authorized to do that'

		getHR : (email, next)->
			dbClient.queryAll 'SELECT id_user, first_name,last_name FROM users WHERE is_hr ORDER BY last_name', next

	    getUsersTasksForCSV: (params, next) ->
			args = []
			whereString = ''
			if params.department?
				whereString += ' WHERE d.id_department = $1'
				args.push params.department
				if params.team?
					whereString += ' AND t.id_team = $2'
					args.push params.team
					if params.user?
						whereString += ' AND u.id_user = $3'
						args.push params.user


			dbClient.queryAll 'SELECT first_name,
							last_name,
							department_title,
							team_title,
							is_admin,
							to_char(started_at, \'dd.mm.yyyy\'),
							tasks_after_sum,
							tasks_finished_sum,
							tasks_unfinished_sum,
							tasks_unfinished_sum + tasks_finished_sum + tasks_after_sum AS all_sum
						FROM (SELECT
							ut.id_user,
							d.title AS department_title,
							t.title AS team_title,
							is_admin,
							count(CASE WHEN date_to < current_date AND NOT completed THEN 1 END) AS tasks_after_sum,
							count(CASE WHEN completed THEN 1 END) AS tasks_finished_sum,
							count(CASE WHEN date_to > current_date AND NOT completed THEN 1 END) AS tasks_unfinished_sum

							FROM users_teams ut
							JOIN teams t ON t.id_team = ut.id_team
							JOIN departments d ON d.id_department = t.id_department ' + activeUsers\
					+' JOIN tasks ta ON ta.id_user = ut.id_user ' + whereString +
					'	GROUP BY d.title, t.title, ut.id_user, is_admin) inside
								JOIN users u ON u.id_user = inside.id_user', args, next
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
						if queryData.filterData.filter1? and not queryData.filterData.filter2?
							query += " JOIN users_teams ut ON ut.id_user=sel.id_user
									   JOIN teams te ON ut.id_team=te.id_team
									   JOIN departments d ON te.id_department=$#{i++}"
							params.push queryData.filterData.filter1

						if queryData.filterData.filter2?
							query += " JOIN users_teams ut ON ut.id_user=sel.id_user
									   JOIN teams te ON ut.id_team=$#{i++}"
							params.push queryData.filterData.filter2

				params.push queryData.offset
				params.push queryData.limit
				query += " ORDER BY #{queryData.sortBy} #{queryData.sort_way} OFFSET $#{i++} LIMIT $#{i++}";
				dbClient.queryAll query, params, next
			else
				query += " ORDER BY full_name"
				dbClient.queryAll query, next


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


		getAllUserTeams: (idUser, next) ->
			dbClient.queryAll """
				SELECT
					ut.is_admin,
					t.title AS team,
					t.id_team,
					d.title AS department,
					d.id_department
				FROM users_teams ut
				JOIN teams t ON t.id_team=ut.id_team
				JOIN departments d ON t.id_department=d.id_department
				WHERE ut.id_user=$1""", [idUser], next

		getBasicUserInfo: (idUser, next) ->
			dbClient.queryOne """
				SELECT
					u.first_name,
					u.last_name,
					u.email,
					u.id_user_role,
					u2.id_user AS id_buddy,
					u2.last_name AS buddy_last_name,
					u2.first_name AS buddy_first_name,
					t.id_team,
					t.id_department
				FROM users u
				LEFT JOIN users u2 ON u.id_buddy = u2.id_user
				LEFT JOIN users_teams ut ON ut.id_user = u.id_user
				LEFT JOIN teams t ON ut.id_team = t.id_team
				WHERE u.id_user=$1
				LIMIT 1""", [idUser], next
	}