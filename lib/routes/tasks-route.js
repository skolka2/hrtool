var debug = require('debug')('hrtool:tasks-router');

/*
* register tasks:list endpoint and call tasks repository to get user tasks
*/
module.exports = function(router, tasksRepository){
	router.register('tasks:list', function(req,next){
		if(req.session.passport.user ===undefined){}else{
			//console.log(req.session.passport.user);
			tasksRepository.data(req,req.session.passport.user.id_user, function(err,data){
				if(err){
					req.io.respond({err: err});	
				}else{
					req.io.respond({data: data});
				}
			});
		}


        // req data
        //next(null, data)
        // next(err)



    } );

};




