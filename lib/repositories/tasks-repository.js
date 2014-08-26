var debug = require('debug')('hrtool:tasks-repository');
var _ = require('lodash-node');

module.exports = function(dbClient){

	return{
        /**
         * Retrieve all tasks from table tasks (+ some another info form other tables which is needed on frontend)
         * and send this data to client
         * @param {function} next - callback function
         * @returns {undefined}
         */
        getAllTasks : function(next){
            dbClient.query("SELECT * FROM tasks AS t INNER JOIN departments AS d ON d.id_department = t.id_task INNER JOIN " +
                    "teams AS ts ON d.id_department = ts.id_department", next);
        },
		getUserTasks : function(id_user, next){
			dbClient.queryAll('SELECT * FROM tasks  WHERE id_user=$1', [id_user], 
				function(err, result){
					next(err,result);
				});
		},
        /**
         * Return all default tasks in database
         * @param next - callback function
         */
        getDefaultTasks : function(next){
            dbClient.queryAll("SELECT * FROM default_tasks", next);
        },
        /**
         * Change value completed to true in task record with id_task = id
         * @param id - id of task
         * @param next - callback function
         */
        finishTask : function(id, next){
            dbClient.update('tasks', {completed: true}, 'id_task=$1', [id], next);
        },
        /**
         * Function will update task's record in database according to data from client
         * @param taskData - new task data
         * @param next - callback function
         */
        updateTask : function(taskData, next){
            var obj = _.pick(taskData, ['id_task', 'title', 'description', 'notes']);
            dbClient.updateOne('tasks', obj, 'id_task=$1', [obj.id_task], next);
        }
	};
};
