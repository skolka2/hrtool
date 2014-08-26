var debug = require('debug')('hrtool:tasks-route');


module.exports = function(router, tasksRepository){

	/*get user´s tasks*/
	router.register('tasks/list', function(req,next){	
		tasksRepository.getUserTasks(req.session.passport.user.id_user, next);
	});

    //All saved tasks will be sent to klient
    router.register('tasks/get-all', function(req, next){
    	tasksRepository.getAllTasks(next);
    });
    /*get tasks where i am buddy in tasks (not user buddy) */
    router.register('tasks/buddy', function(req,next){
        tasksRepository.getBuddyTasks(req.session.passport.user.id_user, next);
        
    });
    
    //All saved default tasks will be sent to klient
    router.register('tasks/get-defaults', function(req, next){
    	tasksRepository.getDefaultTasks(next);
    });

    /*get all tasks where i am admin of a team*/
    router.register('teams/tasks/list', function(req,next){
    	tasksRepository.getTeamTasks(req.session.passport.user.id_user, next);
    	
    });

	 //task will be finished
	 router.register('tasks/finish', function(req, next){
	 	tasksRepository.finishTask(req.data, next);
	 });

    //task data will be updated
    router.register('tasks/update', function(req, next){
    	if(!req.data.id_task)
    		return next('missing key: id_task');
    	tasksRepository.updateTask(req.data, next);
    });

};




