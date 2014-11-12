debug = require('debug') 'hrtool:tasks-repository'
_ = require 'lodash-node'
async = require	'async'


module.exports = (dbClient) ->
	return{
		getAllTasks: (userId, next) ->
			dbClient.queryAll "SELECT 	t.*,
				  u2.first_name AS user_first_name, u2.last_name AS user_last_name, u2.email AS user_email,
				  u3.first_name AS buddy_first_name, u3.last_name AS buddy_last_name, u3.email AS buddy_email
				  FROM tasks t
				  JOIN user_roles ur ON ur.title='Administrator'
				  JOIN users u ON u.id_user=$1 AND u.id_user_role = ur.id_user_role
				  INNER JOIN users u2 ON u2.id_user=t.id_user
				  LEFT JOIN users u3 ON u3.id_user=t.id_buddy", [userId], next

		getUserTasks: (userId, completed, next) ->
			sql = 'SELECT t.* ,
				u1.first_name AS user_first_name, u1.last_name AS user_last_name, u1.email AS user_email,
				u2.first_name AS buddy_first_name, u2.last_name AS buddy_last_name, u2.email AS buddy_email
				FROM tasks AS t
				INNER JOIN users u1 ON u1.id_user=t.id_user
				INNER JOIN users u2 ON u2.id_user=t.id_buddy
				WHERE t.id_user=$1'

			params = [userId]
			if next is null
				next = completed
				completed = null
			else
				sql += ' AND t.completed = $2'
				params.push completed

			dbClient.queryAll sql, params, next

		getBuddyTasks: (userId, completed, next) ->
			sql = 'SELECT t.* ,
				u1.first_name AS user_first_name, u1.last_name AS user_last_name, u1.email AS user_email,
				u2.first_name AS buddy_first_name, u2.last_name AS buddy_last_name, u2.email AS buddy_email
				FROM tasks AS t
				INNER JOIN users u1 ON u1.id_user=t.id_user
				INNER JOIN users u2 ON u2.id_user=t.id_buddy
				WHERE t.id_buddy=$1'

			params = [userId]

			if next is null
				next = completed
				completed = null
			else
				sql += ' AND t.completed = $2'
				params.push completed

			dbClient.queryAll sql, params, next

		getTeamTasks: (userId, completed, id_department, id_team, is_hr, next) ->
			sql = 'SELECT t.* ,
				u1.first_name AS user_first_name, u1.last_name AS user_last_name, u1.email AS user_email,
				u2.first_name AS buddy_first_name, u2.last_name AS buddy_last_name, u2.email AS buddy_email
				FROM tasks AS t'

			sql += ' JOIN users_teams ut ON ut.id_team = t.id_team' unless is_hr

			sql += ' INNER JOIN users u1 ON u1.id_user=t.id_user
				INNER JOIN users u2 ON u2.id_user=t.id_buddy
				WHERE t.id_user<>$1 AND t.completed = $2'

			sql += ' AND ut.id_user=$1 AND ut.is_admin' unless is_hr

			params = [userId, completed]

			if id_department isnt -1
				sql += ' AND t.id_department = $3'
				params.push id_department
			else if id_team isnt -1 and id_department is -1
				sql += ' AND t.id_team = $3'
				params.push id_team
			if id_team isnt -1 and id_department isnt -1
				sql += ' AND t.id_team = $4'
				params.push id_team

			dbClient.queryAll sql, params, next

		finishTask : (id, next) ->
			dbClient.update 'tasks', {completed: true}, 'id_task=$1', [id], next

		updateTask : (taskData, next) ->
			obj = _.pick taskData, ['title', 'description', 'notes']
			dbClient.updateOne 'tasks', obj, 'id_task=$1', [taskData.id_task], next

		insertImplicitTask : (taskData, next) ->
			dbClient.insertOne 'tasks_implicit', taskData, next

		insertNewTask : (taskData, next) ->
			dbClient.insertOne 'tasks', taskData, next

		getCountOfTasks: (userId, next) ->
			sql = "SELECT
							CONCAT(u.last_name,', ',u.first_name) AS full_name,
							COUNT(CASE WHEN t.completed=true THEN 1 END) AS finished_tasks,
							COUNT(CASE WHEN t.completed=false AND current_date > t.date_to THEN 1 END) AS deadline_tasks,
							COUNT (t.completed) AS all_tasks
							FROM tasks t
							RIGHT JOIN users u ON u.id_user=t.id_user
							WHERE u.id_user = $1
							GROUP BY u.id_user"
			params = [userId]
			dbClient.queryAll sql, params, next

		getImplicitTasks: (queryData, next) ->
			unless queryData.sortBy in ['id_task_implicit','title', 'description', 'start_day', 'duration']
				return next 'wrong name column'

			if 'ASC' isnt queryData.sort_way and 'DESC' isnt queryData.sort_way
				return next 'wrong order way (it suppose to be ASC or DESC)'
			filterQuery = ' ';
			params = []
			params.push queryData.offset
			params.push queryData.limit
			development=0
			team = 1
			if queryData?
				if queryData.filterData?
					if queryData.filterData.input?
						params.push queryData.filterData.input
						filterQuery += "AND LOWER(tt.title) LIKE LOWER ($3)"
						development = 0
						team = 1
					if queryData.filterData.filter[development]?
						filterQuery += " WHERE ti.id_department = #{@getValidInt(queryData.filterData.filter[development])}"
						if queryData.filterData.filter[team]?
							filterQuery += " AND ti.id_team = #{@getValidInt(queryData.filterData.filter[team])}"

			dbClient.queryAll """SELECT ti.*, tt.title, tt.description FROM tasks_implicit  ti
				JOIN task_templates tt ON tt.id_task_template = ti.id_task_template
				 #{filterQuery}
				ORDER BY #{queryData.sortBy} #{queryData.sort_way} OFFSET $1 LIMIT $2""", params, next

		getValidInt:(n) ->
			if n % 1 is 0
				return n
			else
				return 0



	isAdminOrManager : (data, next) ->
		async.waterfall([
				(callback) ->
					dbClient.queryOne """SELECT EXISTS (SELECT u.id_user_role FROM user_roles u
							WHERE u.id_user_role = $1 AND u.title = 'Administrator')::int as count""", [data.myRole], callback
			,
				(res, callback) ->
					debug res
					if res.count is 1
						callback null, count: 1
					else
						#returns 1 if myUserId is admin of a team in which is userId otherwise returns 0
						dbClient.queryOne """SELECT EXISTS
						(SELECT ut.id_team FROM  users_teams AS ut
							WHERE  ut.id_user =$1 AND  ut.id_team= ANY (
									SELECT utAdmin.id_team FROM users_teams as utAdmin
					     		WHERE utAdmin.id_user=$2 AND utAdmin.is_admin)
						)::int as count """, [data.userId, data.myUserId],callback
			,
				( res, callback) ->
					if res.count is 1
						debug data.userId
						dbClient.queryOne """SELECT EXISTS
							(SELECT u.id_user FROM users u WHERE u.id_user=$1)::int as count""", [data.userId],callback
					else next( error: "You are not a admin or manager")
			],
		(err, res) ->
			debug res
			if res? and res.count? and res.count is 1
				next null, true
			else
				next( error: "User doesnt exists")


		)



	}

