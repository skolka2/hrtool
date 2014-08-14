var debug = require('debug')('hrtool:tasks-repository');

/* 
* get all user's tasks
*/
module.exports = function(dbClient){

	return{
		getUserTasks : function(id_user, next){
			dbClient.queryAll('SELECT * FROM tasks  WHERE id_user=$1', [id_user], 
				function(err, result){
					next(err,result);
				});
		}



	}
}