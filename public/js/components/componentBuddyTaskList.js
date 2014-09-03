var ComponentBuddyTaskList = function() {
	ComponentBase.call(this);
	this.super = ComponentBase;
	this.data = null;
	//this.model = new Model (ComponentBuddyTaskList.EventType.DATA_LOAD);
	//this.listen(ComponentBuddyTaskList.EventType.DATA_LOAD, this.model, this.onLoad);
	//hrtool.actions.getBuddyTaskData(this.model);
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

		var task = new ComponentTaskDetail(taskDataModified);
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
	DATA_LOAD_NOT_COMPLETED: 'tasks/buddy/list/notCompleted'
};

ComponentBuddyTaskList.Factory = {

	createBuddyTaskList: function(finishedTasks) {
		var buddyList = new ComponentBuddyTaskList();

		if(finishedTasks == true) {
			var buddyListModel = new Model(ComponentBuddyTaskList.EventType.DATA_LOAD_COMPLETED);
			buddyList.setModel(buddyListModel, ComponentBuddyTaskList.EventType.DATA_LOAD_COMPLETED);
			hrtool.actions.getBuddyTaskDataCompleted(buddyList.model);
		}
		else if(finishedTasks == false) {
			var buddyListModel = new Model(ComponentBuddyTaskList.EventType.DATA_LOAD_NOT_COMPLETED);
			buddyList.setModel(buddyListModel, ComponentBuddyTaskList.EventType.DATA_LOAD_NOT_COMPLETED);
			hrtool.actions.getBuddyTaskDataNotCompleted(buddyList.model);
		}
		else {
			var buddyListModel = new Model(ComponentBuddyTaskList.EventType.DATA_LOAD);
			buddyList.setModel(buddyListModel, ComponentBuddyTaskList.EventType.DATA_LOAD);
			hrtool.actions.getBuddyTaskData(buddyList.model);
		}
		
		return buddyList;
	}
};