var ComponentBuddyTaskList = require('./componentBuddyTaskList');
var Model = require('../../models/model');
var hrtool = require('../../models/actions');
var ComponentBuddyTaskListFactory = module.exports = {

	createCompleted: function() {
		var buddyTaskList = new ComponentBuddyTaskList();
		var buddyTaskListModel = new Model(ComponentBuddyTaskList.EventType.DATA_LOAD_COMPLETED);
		buddyTaskList.setModel(buddyTaskListModel, ComponentBuddyTaskList.EventType.DATA_LOAD_COMPLETED);
		hrtool.actions.getBuddyTaskDataCompleted(buddyTaskList.model);
		return buddyTaskList;
	},

	createNotCompleted: function() {
		var buddyTaskList = new ComponentBuddyTaskList();
		var buddyTaskListModel = new Model(ComponentBuddyTaskList.EventType.DATA_LOAD_NOT_COMPLETED);
		buddyTaskList.setModel(buddyTaskListModel, ComponentBuddyTaskList.EventType.DATA_LOAD_NOT_COMPLETED);
		hrtool.actions.getBuddyTaskDataNotCompleted(buddyTaskList.model);
		return buddyTaskList;
	},

	createAll: function() {
		var buddyTaskList = new ComponentBuddyTaskList();
		var buddyTaskListModel = new Model(ComponentBuddyTaskList.EventType.DATA_LOAD);
		buddyTaskList.setModel(buddyTaskListModel, ComponentBuddyTaskList.EventType.DATA_LOAD);
		hrtool.actions.getBuddyTaskData(buddyTaskList.model);
		return buddyTaskList;
	}
}