var debug = require('debug')('hrtool:tasks-repository');

/* 
* get all user's tasks
*/
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
        getDefaultTasks : function(next){
            dbClient.queryAll("SELECT * FROM default_tasks", next);
        }




	};
};
