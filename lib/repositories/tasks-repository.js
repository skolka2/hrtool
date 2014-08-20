var debug = require('debug')('hrtool:tasks-repository');


module.exports = function(dbClient){

	return{
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
        }
	};
};
