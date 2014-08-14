var debug = require('debug')('hrtool:tasks-route');

/*
* register tasks:list endpoint and call tasks repository to get user tasks
* it returns succesfully in format next(null, data)
* otherwise next(err)
*/
module.exports = function(router, tasksRepository){
	router.register('tasks:list', function(req,next){
		
			debug("register tasks list");
			tasksRepository.getUserTasks(req.session.passport.user.id_user, next);
		
	});

};




