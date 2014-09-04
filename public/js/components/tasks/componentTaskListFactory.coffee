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
		createCompleted: ->
			userTaskList = new ComponentTaskList ComponentTaskListFactory.userTaskDetailSelection
			userTaskListModel = new Model ComponentTaskList.EventType.user.DATA_LOAD_COMPLETED
			userTaskList.setModel userTaskListModel, ComponentTaskList.EventType.user.DATA_LOAD_COMPLETED
			hrtool.actions.getUserTaskDataCompleted userTaskList.model
			userTaskList
		createNotCompleted: ->
			userTaskList = new ComponentTaskList ComponentTaskListFactory.userTaskDetailSelection
			userTaskListModel = new Model ComponentTaskList.EventType.user.DATA_LOAD_NOT_COMPLETED
			userTaskList.setModel userTaskListModel, ComponentTaskList.EventType.user.DATA_LOAD_NOT_COMPLETED
			hrtool.actions.getUserTaskDataNotCompleted userTaskList.model
			userTaskList

	BuddyTaskList: 
		createCompleted: ->
			buddyTaskList = new ComponentTaskList ComponentTaskListFactory.baseTaskDetailSelection
			buddyTaskListModel = new Model ComponentTaskList.EventType.buddy.DATA_LOAD_COMPLETED
			buddyTaskList.setModel buddyTaskListModel, ComponentTaskList.EventType.buddy.DATA_LOAD_COMPLETED
			hrtool.actions.getBuddyTaskDataCompleted buddyTaskList.model
			buddyTaskList
		createNotCompleted: ->
			buddyTaskList = new ComponentTaskList ComponentTaskListFactory.baseTaskDetailSelection
			buddyTaskListModel = new Model ComponentTaskList.EventType.buddy.DATA_LOAD_NOT_COMPLETED
			buddyTaskList.setModel buddyTaskListModel, ComponentTaskList.EventType.buddy.DATA_LOAD_NOT_COMPLETED
			hrtool.actions.getBuddyTaskDataNotCompleted buddyTaskList.model
			buddyTaskList

	ManagerTaskList:
		createCompleted: ->
			managerList = new ComponentTaskList ComponentTaskListFactory.baseTaskDetailSelection
			managerListModel = new Model ComponentTaskList.EventType.manager.DATA_LOAD_COMPLETED
			managerList.setModel managerListModel, ComponentTaskList.EventType.manager.DATA_LOAD_COMPLETED
			hrtool.actions.getManagerTaskDataCompleted managerList.model, id_department: -1, id_team: -1, is_hr: helper.bulk.getData ["user","is_hr"]
			managerList
		createNotCompleted: ->
			managerList = new ComponentTaskList ComponentTaskListFactory.baseTaskDetailSelection
			managerListModel = new Model ComponentTaskList.EventType.manager.DATA_LOAD_NOT_COMPLETED
			managerList.setModel managerListModel, ComponentTaskList.EventType.manager.DATA_LOAD_NOT_COMPLETED
			hrtool.actions.getManagerTaskDataNotCompleted managerList.model, id_department: -1, id_team: -1, is_hr: helper.bulk.getData ["user","is_hr"]
			managerList

module.exports = ComponentTaskListFactory