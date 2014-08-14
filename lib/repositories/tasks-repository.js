var debug = require('debug')('hrtool:tasks-repository');

module.exports = function(dbClient){

	return{

		data : function(req){
			dbClient.query('SELECT * FROM tasks  WHERE id_user=$1', [req.session.passport.user.id_user], 
				function(err, result){
					if(err){
						debug('data: database error: ' + err);
						req.io.respond(err);
					}else{
						//console.log(result);
						debug('data: ' + result);
						req.io.respond(result.rows);
						//req.io.emit("tasks:list",result.rows);
					}
				});
		}
	}


}