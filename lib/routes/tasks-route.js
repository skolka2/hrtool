var debug = require('debug')('hrtool:tasks-router');

/*
* register tasks:list endpoint and call tasks repository to get user tasks
*/
module.exports = function(router, tasksRepository){
	router.register('tasks:list', function(req,next){

		if(req.session.passport.user ===undefined){
			//you are not register
		}else{
			tasksRepository.data(req);

		}

        // req data
        //next(null, data)
        // next(err)



    } );

};




