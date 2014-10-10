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
			sql = 'SELECT t.*, u.email AS buddy_email, u.last_name AS buddy_last_name, u.first_name AS buddy_first_name
						  FROM tasks t
						  LEFT JOIN users u ON u.id_user= t.id_buddy
						  WHERE t.id_user=$1';
			params = [userId];

			if next is null
				next = completed
				completed = null
			else
				sql += ' AND t.completed = $2'
				params.push completed

			dbClient.queryAll sql, params, next

		getBuddyTasks : (userId, completed, next) ->
			sql = 'SELECT t.*, u.*
				  FROM tasks t
				  JOIN users u ON u.id_user = t.id_user
				  WHERE t.id_buddy = $1';

			params = [userId];

			if next is null
				next = completed
				completed = null
			else
				sql += ' AND t.completed = $2'
				params.push completed

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

	}