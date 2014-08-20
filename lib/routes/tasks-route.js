var debug = require('debug')('hrtool:tasks-route');


module.exports = function(router, tasksRepository){

	router.register('tasks/list', function(req,next){
        debug("register tasks list");
        tasksRepository.getUserTasks(req.session.passport.user.id_user, next);
	});

    //All saved tasks will be sent to klient
    router.register('tasks/get-all', function(req, next){
        tasksRepository.getAllTasks(next);
    });

    //All saved default tasks will be sent to klient
    router.register('tasks/get-defaults', function(req, next){
        tasksRepository.getDefaultTasks(next);
    });

    //task will be finished
    router.register('tasks/finish', function(req, next){
        tasksRepository.finishTask(req.data, next);
    });

    //task data will be updated
    router.register('tasks/update', function(req, next){
        tasksRepository.updateTask(req.data, next);
    });

};




