ViewBase =  require './viewBase'
Const = require '../helpers/constants'
helper = require '../helpers/helpers'
ComponentTaskListsInView = require '../components/tasks/componentTaskListsInView'
ComponentTaskListFactory = require '../components/tasks/componentTaskListFactory'
ComponentStatusBarFactory = require '../components/features/componentStatusBarFactory'
ComponentNotificationCenter = require '../components/componentNotificationCenter'
ComponentPrivileges = require '../components/features/componentPrivileges'


class ViewHome extends ViewBase
	constructor: (parameters)->
		@routerParams = parameters
		super()

	render : ->
		super(arguments)
		mainWrapper = document.getElementById(ViewBase.mainWrapper)
		viewWrapper = document.createElement('div')
		userRole = helper.bulk.getData(["user", "id_user_role"])
		viewWrapper.className = "view-wraper"
		viewWrapper.innerHTML = "Home View"


		if @routerParams?
				if @routerParams.user?
					privileges = new ComponentPrivileges()

					privileges.isAdminOrManager @routerParams.user, (isAdmin)=>
						if isAdmin
							statusBar = ComponentStatusBarFactory.createStatusBar @routerParams.user
							statusBar.render viewWrapper
							@userTaskView viewWrapper, @routerParams.user
						else
							#privileges.render viewWrapper
							privileges.isNotAdminNotification()
							@userTaskView viewWrapper
							@managerTaskView userRole, viewWrapper


		else
			@userTaskView viewWrapper
			@managerTaskView userRole, viewWrapper


		mainWrapper.appendChild viewWrapper

	userTaskView :(viewWrapper, userIdToWatch)->
		userTaskLists = new ComponentTaskListsInView "Your tasks:", ComponentTaskListFactory.UserTaskList.createCompleted(userIdToWatch), ComponentTaskListFactory.UserTaskList.createNotCompleted(userIdToWatch)
		userTaskLists.render viewWrapper
		buddyTaskLists = new ComponentTaskListsInView "Tasks, for which you are buddy:", ComponentTaskListFactory.BuddyTaskList.createCompleted(userIdToWatch), ComponentTaskListFactory.BuddyTaskList.createNotCompleted(userIdToWatch)
		buddyTaskLists.render viewWrapper

	managerTaskView :(userRole, viewWrapper) ->
		if userRole is Const.TEAM_MANAGER || userRole is Const.ADMINISTRATOR
			managerTaskLists = new ComponentTaskListsInView("Tasks of people from your departments/teams:", ComponentTaskListFactory.ManagerTaskList.createCompleted(), ComponentTaskListFactory.ManagerTaskList.createNotCompleted(), true)
			managerTaskLists.render viewWrapper




module.exports = ViewHome