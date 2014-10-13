async = require 'async'
debug = require('debug') 'hrtool:index'

module.exports = (dbClient) ->
	return {
	createBulk: (user, next) ->
		async.parallel
			departments: (next) ->
				dbClient.queryAll "SELECT * FROM departments", (err, rows)->
					return next err if err
					out = {}
					for item in rows
						out[item.id_department] = item
					next null, out
			teams: (next) ->
				dbClient.queryAll "SELECT * FROM teams", (err, rows)->
					return next err if err
					out = {}
					for item in rows
						out[item.id_team] = item
					next null, out
			hrBuddy: (next) ->
				dbClient.queryOne "SELECT * FROM users WHERE id_user=$1", [user.id_buddy], next
			userTeams: (next) ->
				dbClient.queryAll """
						SELECT t.* FROM teams t
						JOIN users_teams ut ON ut.id_team=t.id_team
						JOIN users u ON u.id_user=ut.id_user WHERE u.id_user=$1 AND ut.is_admin=TRUE""", [user.id_user], (err, rows) ->
					return next err if err
					out = {}
					for item in rows
						out[item.id_team] = item
					next null, out
			userDepartments: (next) ->
				dbClient.queryAll """
						SELECT d.* FROM departments d
						JOIN teams t ON t.id_department=d.id_department
						JOIN users_teams ut ON ut.id_team=t.id_team
						JOIN users u ON u.id_user=ut.id_user WHERE u.id_user=$1""", [user.id_user], (err, rows) ->
					return next err if err
					out = {}
					for item in rows
						out[item.id_department] = item
					next null, out
			userRoles: (next) ->
				dbClient.queryAll "SELECT * FROM user_roles", next
			departmentRoles: (next) ->
				dbClient.queryAll "SELECT * FROM department_roles", next
		,
			(err, res) ->
				if err
					debug 'bulk error: \n #{err}'
					next err
				else
					res.user = user
					res.map = {}
					for key, value of res.departments
						arr = []
						for key2, value2 of res.teams
							arr.push value2.id_team if value2.id_department is value.id_department
						res.map[value.id_department] = arr
					debug 'bulk ok'
					next null, res

	}