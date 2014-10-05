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

	router.register 'tasks/get-defaults', (req, next) ->
		tasksRepository.getDefaultTasks next

	router.register 'tasks/teams/list', (req, next) ->
		tasksRepository.getTeamTasks req.session.passport.user.id_user, next

	router.register 'tasks/teams/list/completed', (req, next) ->
		return next 'missing one or more keys' unless req.data.id_department? and req.data.id_team? and req.data.is_hr?
		tasksRepository.getTeamTasks req.session.passport.user.id_user, true, req.data.id_department, req.data.id_team, req.data.is_hr, next

	router.register 'tasks/teams/list/not-completed', (req, next) ->
		return next 'missing one or more keys' unless req.data.id_department? and req.data.id_team? and req.data.is_hr?
		tasksRepository.getTeamTasks req.session.passport.user.id_user, false, req.data.id_department, req.data.id_team, req.data.is_hr, next

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

	router.register 'tasks/count', (req, next) ->
		tasksRepository.getCountOfTasks req.session.passport.user.id_user, next
		tasksRepository.insertNewTask req.data, next

	router.register 'tasks/implicit/list', (req, next) ->
		tasksRepository.getImplicitTasks req.data, next