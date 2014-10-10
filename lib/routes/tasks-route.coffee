debug = require('debug')('hrtool:user-route')

module.exports = (router, tasksRepository) ->

	router.register 'tasks/user/list', (req, next) ->
		tasksRepository.getUserTasks req.session.passport.user.id_user, next

	router.register 'tasks/user/list/completed', (req, next) ->
		tasksRepository.getUserTasks req.session.passport.user.id_user, true, next

	router.register 'tasks/user/list/not-completed', (req, next) ->
		tasksRepository.getUserTasks req.session.passport.user.id_user, false, next

	router.register 'tasks/get-all', (req, next) ->
		userRepository.insertUsersFromCSV req.data.id_user, false, next

	router.register 'tasks/buddy/list', (req,next) ->
		tasksRepository.getBuddyTasks req.session.passport.user.id_user, next

	router.register 'tasks/buddy/list/completed', (req,next) ->
		tasksRepository.getBuddyTasks req.session.passport.user.id_user, true, next

	router.register 'tasks/buddy/list/not-completed', (req,next) ->
		tasksRepository.getBuddyTasks req.session.passport.user.id_user, false, next

	router.register 'tasks/finish', (req, next) ->
		return next 'missing key: id_task' unless req.data.id_task
		tasksRepository.finishTask req.data.id_task, next

	router.register 'tasks/update', (req, next) ->
		return next 'missing key: id_task' unless req.data.id_task
		tasksRepository.updateTask req.data, next

	router.register 'tasks/implicit/insert', (req, next) ->
		tasksRepository.insertImplicitTask req.data, next

	router.register 'tasks/insert', (req, next) ->
		tasksRepository.insertNewTask req.data, next