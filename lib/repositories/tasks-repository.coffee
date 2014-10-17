debug = require('debug') 'hrtool:tasks-repository'
_ = require 'lodash-node'


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

			sql = 'SELECT t.*, u.email AS buddy_email, u.last_name AS buddy_last_name, u.first_name AS buddy_first_name
						  FROM tasks t
						  LEFT JOIN users u ON u.id_user= t.id_buddy
						  WHERE t.id_user=$1'
			params = [userId];

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
			sql = 'SELECT
				  (SELECT COUNT(t.id_task) FROM tasks t WHERE t.id_user = $1) AS all_tasks,
				  (SELECT COUNT(t.id_task) FROM tasks t WHERE t.id_user = $1 AND t.completed) AS finished_tasks,
				  (SELECT COUNT(t.id_task) FROM tasks t WHERE t.id_user = $1 AND NOT t.completed AND current_date > t.date_to) AS deadline_tasks'

			params = [userId]

			dbClient.queryAll sql, params, next
	}