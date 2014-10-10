debug = require('debug') 'hrtool:user-repository'
parse = require 'csv-parse'
_ = require 'lodash-node'
async = require	'async'

module.exports = (dbClient) ->
	return {
		isertUser: (userData, next)->
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
				for i, row in rows
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
					dbClient.queryAll """SELECT u.*, ut.id_team, t.id_department, CONCAT(u.last_name,', ',u.first_name) AS full_name
					   FROM users u
					   JOIN users_teams ut ON u.id_user=ut.id_user
					   JOIN teams t ON ut.id_team=t.id_team""", next
				else
					return next 'Not authorized to do that'

		getHR : (email, next)->
			dbClient.queryAll 'SELECT id_user, first_name,last_name FROM users WHERE is_hr ORDER BY last_name', next

	}