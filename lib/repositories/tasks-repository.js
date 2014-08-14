var debug = require('debug')('hrtool:tasks-repository');

module.exports = function(dbClient){

	return{

		data : function(req,id_user, next){
			dbClient.query('SELECT * FROM tasks  WHERE id_user=$1', [id_user], 
				function(err, result){
					next(err,result.rows);

				});
		}



	}
}