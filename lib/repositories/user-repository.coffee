debug = require('debug') 'hrtool:user-repository'
parse = require 'csv-parse'
_ = require 'lodash-node'
async = require	'async'

module.exports = (dbClient) ->
	return {
		insertUser: (userData, next) ->
			dbClient.begin()
			userDataInfo = _.pick userData, ['first_name', 'last_name', 'email', 'is_hr', 'id_department_role', 'id_buddy']
			userDataInfo.started_at = new Date().toDateString()
			userDataAdminTeam = _.pick userData, ['is_admin', 'id_team']
			debug userData
			debug userDataAdminTeam.is_admin
			async.waterfall([
					(callback) ->
						title = if userDataAdminTeam.is_admin is yes then 'Team manager' else 'User'
						debug title
						dbClient.queryOne "SELECT id_user_role FROM user_roles WHERE title=$1", [title], callback
				,
					(idUserRole, callback) ->
						userDataInfo['id_user_role'] = idUserRole.id_user_role
						dbClient.insertOne 'users', userDataInfo, callback
				,
					(insertedUser, callback) ->
						userDataAdminTeam['id_user'] = insertedUser.id_user
						dbClient.insertOne 'users_teams', userDataAdminTeam, callback
				,
					(userTeam, callback) ->
						dbClient.queryAll """SELECT t.id_department, t.id_team FROM users_teams AS u
								JOIN teams AS t ON u.id_team  = t.id_team WHERE u.id_user = $1""", [userDataAdminTeam.id_user], callback
				,
					(depsAndTeams, callback) ->
						userDataInfo['id_department'] = depsAndTeams[0].id_department
						query = "SELECT t.title, t.description,i.id_team, i.id_department, i.start_day, i.duration FROM tasks_implicit AS i
											JOIN task_templates AS t ON i.id_task_template = t.id_task_template  WHERE "
						query += "(i.id_department is null AND i.id_team is null) OR
											((i.id_department= #{depsAndTeams[0].id_department} AND i.id_team is null)
												OR (i.id_department= #{depsAndTeams[0].id_department} AND i.id_team = #{depsAndTeams[0].id_team }))"
						for item in  depsAndTeams
							query += " OR ((i.id_department= #{item.id_department} AND i.id_team is null)
												 OR (i.id_department= #{item.id_department} AND i.id_team = #{item.id_team}))"
						dbClient.queryAll query, callback
				,
					(tasks, callback) ->
						unless tasks.length
							callback null, 'none tasks'
						else
							values = [];
							date = new Date();
							for item,i in tasks
								startDate = _.clone date
								startDate.setDate date.getDate() + item.start_day
								duration = _.clone startDate
								duration.setDate startDate.getDate() + item.duration
								values.push(
									title: item['title'],
									description: item['description'],
									completed: no,
									date_from: startDate.toDateString(),
									date_to: duration.toDateString(),
									id_user: userDataAdminTeam.id_user,
									id_buddy: userDataInfo.id_buddy,
									id_department: item.id_department
									id_team : null
								)
								if item.id_department?
									values[i]['id_department'] = item.id_department
								else
									values[i]['id_department'] = userDataInfo.id_department
								if item.id_team?
									values[i]['id_team'] = item.id_team
								else
									values[i]['id_team'] = userDataAdminTeam.id_team
							dbClient.insert "tasks", values, callback
				,	(insertedUser, callback) ->
						dbClient.commit callback
				],(e, commit) ->
					if e?
						dbClient.rollback()
						if e.code? and e.code is "23505"
							next error: "User's email already exists "
						else
							next error : e.detail
					else
						next null, commit
			)

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