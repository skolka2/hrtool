var ComponentBase = require('../componentBase');
var ComponentTaskDetail = require('../tasks/componentTaskDetail');

var ComponentBuddyTaskList = module.exports = function() {
	ComponentBase.call(this);
	this.super = ComponentBase;
	this.data = null;
}

ComponentBuddyTaskList.prototype = new ComponentBase();
ComponentBuddyTaskList.prototype.constructor = ComponentBuddyTaskList;

ComponentBuddyTaskList.prototype.onLoad = function(data) {
	this.data = data;

	for(var i = 0; i < this.data.length; i++) {
		var taskData = this.data[i];

		var taskDataModified = {
			taskBuddy: taskData.email,
			taskTitle: taskData.title,
			dateFrom: taskData.date_from,
			dateTo: taskData.date_to,
			taskDescription: taskData.description,
			taskNotes: taskData.notes,
			isFinished: taskData.completed
		};

		var task = new ComponentBaseTaskDetail(taskDataModified);
		this.addChild("buddyTask"+i, task, {'el': this.getElement()});

		if(this.rendered) {
			this.getElement().appendChild(task.getElement());
		}
	}
	//this.render(this.element.parrentNode);
}

ComponentBuddyTaskList.prototype.createDom = function() {
	var wrapper = document.createElement('div');
	wrapper.className = "buddy-task-list";
	this.element = wrapper;
}

ComponentBuddyTaskList.EventType = {
	DATA_LOAD: 'tasks/buddy/list',
	DATA_LOAD_COMPLETED: 'tasks/buddy/list/completed',
	DATA_LOAD_NOT_COMPLETED: 'tasks/buddy/list/not-completed'
}