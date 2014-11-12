
ViewHomeBase =  require './viewHomeBase'
ComponentTaskListsInView = require '../components/tasks/componentTaskListsInView'
ComponentTaskListFactory = require '../components/tasks/componentTaskListFactory'
ComponentNotificationCenter = require '../components/componentNotificationCenter'
ComponentPrivileges = require '../components/features/componentPrivileges'


class ViewBuddyTasks extends ViewHomeBase
	constructor: (parameters)->
		super(parameters)

	render : ->
		super()
		mainWrapper = document.getElementById ViewHomeBase.mainWrapper
		viewWrapper = document.createElement 'div'
		viewWrapper.className = 'view-wraper'
		if @routerParams?.user?
			privileges = new ComponentPrivileges()
			privileges.isAdminOrManager @routerParams.user, (isAdmin, errMessage)=>
				if isAdmin
					@buddyTaskView viewWrapper, @routerParams.user
				else
					privileges.isNotAdminNotification errMessage
					@buddyTaskView viewWrapper
		else
			@buddyTaskView viewWrapper

		mainWrapper.appendChild viewWrapper
		return


	buddyTaskView :(viewWrapper, userId) ->
		buddyTaskLists = new ComponentTaskListsInView ViewBuddyTasks.messages.BUDDY_TASKS_TITLE,
			ComponentTaskListFactory.BuddyTaskList.createCompleted(userId), ComponentTaskListFactory.BuddyTaskList.createNotCompleted(userId)
		buddyTaskLists.render viewWrapper

ViewBuddyTasks.messages =
	BUDDY_TASKS_TITLE: 'Tasks, for which you are buddy:'

module.exports = ViewBuddyTasks