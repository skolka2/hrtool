var debug = require('debug')('hrtool:tasks-route');


module.exports = function(router, tasksRepository){
	router.register('tasks:list', function(req,next){
        debug("register tasks list");
        tasksRepository.getUserTasks(req.session.passport.user.id_user, next);
	});

    //All saved tasks will be sent to klient
    router.register('tasks:get-all', function(req, next){
        tasksRepository.getAllTasks(next);
    });

};




