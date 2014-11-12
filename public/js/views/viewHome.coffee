
ViewHomeBase =  require './viewHomeBase'
ComponentTaskListsInView = require '../components/tasks/componentTaskListsInView'
ComponentTaskListFactory = require '../components/tasks/componentTaskListFactory'
ComponentStatusBarFactory = require '../components/features/componentStatusBarFactory'
ComponentNotificationCenter = require '../components/componentNotificationCenter'
ComponentPrivileges = require '../components/features/componentPrivileges'


class ViewHome extends ViewHomeBase
	constructor: (parameters)->
		super(parameters)

	render : ->
		super()
		mainWrapper = document.getElementById(ViewHomeBase.mainWrapper)
		viewWrapper = document.createElement 'div'
		viewWrapper.className = 'view-wraper'
		if @routerParams?.user?
			privileges = new ComponentPrivileges()
			privileges.isAdminOrManager @routerParams.user, (isAdmin, errMessage)=>
				if isAdmin
					statusBar = ComponentStatusBarFactory.createStatusBar @routerParams.user
					statusBar.render viewWrapper
					@userTaskView viewWrapper, @routerParams.user
				else
					privileges.isNotAdminNotification errMessage
					@userTaskView viewWrapper
		else
			@userTaskView viewWrapper

		mainWrapper.appendChild viewWrapper
		return

	userTaskView :(viewWrapper, userId) ->
		userTaskLists = new ComponentTaskListsInView ViewHome.messages.USER_TASK_TITLE,
			ComponentTaskListFactory.UserTaskList.createCompleted(userId), ComponentTaskListFactory.UserTaskList.createNotCompleted(userId)
		userTaskLists.render viewWrapper


ViewHome.messages =
	USER_TASK_TITLE : 'My tasks'

module.exports = ViewHome