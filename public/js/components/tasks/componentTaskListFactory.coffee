ComponentTaskList = require './componentTaskList'
Model = require '../../models/model'
hrtool = require '../../models/actions'
helper = require '../../helpers/helpers'
ComponentUserTaskDetail = require './taskDetails/componentUserTaskDetail'
ComponentBaseTaskDetail = require './taskDetails/componentBaseTaskDetail'

ComponentTaskListFactory =
	userTaskDetailSelection: (data) -> new ComponentUserTaskDetail(data)
	baseTaskDetailSelection:  (data) -> new ComponentBaseTaskDetail(data)

	UserTaskList:
		createCompleted: (userIdToWatch) ->
			userTaskList = new ComponentTaskList ComponentTaskListFactory.userTaskDetailSelection
			userTaskListModel = new Model ComponentTaskList.eventType.user.DATA_LOAD_COMPLETED
			userTaskList.setModel userTaskListModel, ComponentTaskList.eventType.user.DATA_LOAD_COMPLETED
			hrtool.actions.getUserTaskDataCompleted userTaskList.model, userIdToWatch
			userTaskList
		createNotCompleted: (userIdToWatch) ->
			userTaskList = new ComponentTaskList ComponentTaskListFactory.userTaskDetailSelection
			userTaskListModel = new Model ComponentTaskList.eventType.user.DATA_LOAD_NOT_COMPLETED
			userTaskList.setModel userTaskListModel, ComponentTaskList.eventType.user.DATA_LOAD_NOT_COMPLETED
			hrtool.actions.getUserTaskDataNotCompleted userTaskList.model, userIdToWatch
			userTaskList

	BuddyTaskList: 
		createCompleted: (userIdToWatch) ->
			buddyTaskList = new ComponentTaskList ComponentTaskListFactory.baseTaskDetailSelection
			buddyTaskListModel = new Model ComponentTaskList.eventType.buddy.DATA_LOAD_COMPLETED
			buddyTaskList.setModel buddyTaskListModel, ComponentTaskList.eventType.buddy.DATA_LOAD_COMPLETED
			hrtool.actions.getBuddyTaskDataCompleted buddyTaskList.model, userIdToWatch
			buddyTaskList
		createNotCompleted: (userIdToWatch) ->
			buddyTaskList = new ComponentTaskList ComponentTaskListFactory.baseTaskDetailSelection
			buddyTaskListModel = new Model ComponentTaskList.eventType.buddy.DATA_LOAD_NOT_COMPLETED
			buddyTaskList.setModel buddyTaskListModel, ComponentTaskList.eventType.buddy.DATA_LOAD_NOT_COMPLETED
			hrtool.actions.getBuddyTaskDataNotCompleted buddyTaskList.model, userIdToWatch
			buddyTaskList

	ManagerTaskList:
		createCompleted: ->
			managerList = new ComponentTaskList ComponentTaskListFactory.baseTaskDetailSelection
			managerListModel = new Model ComponentTaskList.eventType.manager.DATA_LOAD_COMPLETED
			managerList.setModel managerListModel, ComponentTaskList.eventType.manager.DATA_LOAD_COMPLETED
			hrtool.actions.getManagerTaskDataCompleted managerList.model, id_department: -1, id_team: -1, is_hr: helper.bulk.getData ["user","is_hr"]
			managerList
		createNotCompleted: ->
			managerList = new ComponentTaskList ComponentTaskListFactory.baseTaskDetailSelection
			managerListModel = new Model ComponentTaskList.eventType.manager.DATA_LOAD_NOT_COMPLETED
			managerList.setModel managerListModel, ComponentTaskList.eventType.manager.DATA_LOAD_NOT_COMPLETED
			hrtool.actions.getManagerTaskDataNotCompleted managerList.model, id_department: -1, id_team: -1, is_hr: helper.bulk.getData ["user","is_hr"]
			managerList

module.exports = ComponentTaskListFactory