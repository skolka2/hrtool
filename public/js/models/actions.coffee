Mediator = require './mediator'

hrtool = hrtool || {}

hrtool.actions =
	getTaskData: (model) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/get-all', {}, model
		return

	getTemplatesData: (model) ->
		mediator = new Mediator()
		mediator.loadData 'template/get-all', {}, model
		return

	saveDefaultTaskData: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'template/update', data, model
		return

	deleteDefaultTaskData: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'template/delete', data, model
		return

	getBuddyTaskData: (model) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/buddy/list', {}, model
		return

	getBuddyTaskDataCompleted: (model) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/buddy/list/completed', {}, model
		return

	getBuddyTaskDataNotCompleted: (model) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/buddy/list/not-completed', {}, model
		return

	saveImplicitTaskData: (model,data) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/implicit/insert', data, model
		return

	getUserTaskData: (model) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/user/list', {}, model
		return

	getUserTaskDataCompleted: (model) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/user/list/completed', {}, model
		return

	getUserTaskDataNotCompleted: (model) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/user/list/not-completed', {}, model
		return

	updateUserTaskData: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/update', data, model
		return

	finishUserTask: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/finish', data, model
		return

	getUsers: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'user/get-all', data, model
		return

	getUsersForTable: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'user/get-table-data', data, model

	insertNewTask: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/insert', data, model
		return

	insertNewTemplate: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'template/insert', data, model
		return

	saveFormAddUser: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'user/insert', data, model
		return

	getHR: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'user/get/HR', data, model
		return

	getImplicitTasks: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/implicit/list', data, model

	getUserTeams: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'user/get-teams', data, model

	getBasicUserInfo: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'user/get-basic-info', data, model

	getManagerTaskData: (model) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/teams/list', {}, model
		return

	getManagerTaskDataCompleted: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/teams/list/completed', data, model
		return

	getManagerTaskDataNotCompleted: (model, data) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/teams/list/not-completed', data, model
		return

	getTasksCount: (model) ->
		mediator = new Mediator()
		mediator.loadData 'tasks/count', {}, model
		return

module.exports = hrtool