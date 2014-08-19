var debug = require('debug')('hrtool:tasks-repository');


module.exports = function(dbClient){

	return{
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
