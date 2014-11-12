ViewHomeBase =  require './viewHomeBase'
Const = require '../helpers/constants'
ComponentTaskListsInView = require '../components/tasks/componentTaskListsInView'
ComponentTaskListFactory = require '../components/tasks/componentTaskListFactory'
helper = require '../helpers/helpers'

class ViewTeamTasks extends ViewHomeBase
	constructor: (parameters)->
		super()

	render : ->
		super()
		mainWrapper = document.getElementById ViewHomeBase.mainWrapper
		viewWrapper = document.createElement 'div'
		viewWrapper.className = 'view-wraper'
		userRole = helper.bulk.getData ['user', 'id_user_role']
		if userRole is Const.TEAM_MANAGER or userRole is Const.ADMINISTRATOR
			managerTaskLists = new ComponentTaskListsInView ViewTeamTasks.messages.TEAM_TASKS_TITLE,
				ComponentTaskListFactory.ManagerTaskList.createCompleted(), ComponentTaskListFactory.ManagerTaskList.createNotCompleted(), true
			managerTaskLists.render viewWrapper

		mainWrapper.appendChild viewWrapper

ViewTeamTasks.messages =
	TEAM_TASKS_TITLE: 'Tasks of people from your departments/teams:'



module.exports = ViewTeamTasks