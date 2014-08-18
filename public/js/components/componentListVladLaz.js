var ComponentListVladLaz = function() {
	ComponentBase.call(this);
	this.super = ComponentBase;
	this.data = null;
	this.model = new Model (ComponentListVladLaz.EventType.DATA_LOAD);
	this.listen(ComponentListVladLaz.EventType.DATA_LOAD, this.model, this.onLoad);
	hrtool.actions.getUserTaskData(this.model);
}

ComponentListVladLaz.prototype = new ComponentBase();
ComponentListVladLaz.prototype.constructor = ComponentListVladLaz;

ComponentListVladLaz.prototype.onLoad = function(data) {
	this.data = data;

	for(var i = 0; i < this.data.length; i++) {
		var taskData = this.data[i];

		var taskDataModified = {
			taskId: taskData.id_task,
			taskBuddy: taskData.email,
			taskTitle: taskData.title,
			dateFrom: taskData.date_from,
			dateTo: taskData.date_to,
			taskDescription: taskData.description,
			taskNotes: taskData.notes,
			isFinished: taskData.completed
		};
		
		var task = new ComponentUserTaskDetail(taskDataModified);
		this.addChild("userTask"+i, task, this.getElement());

		if(this.rendered) {
			this.getElement().appendChild(task.getElement());
		}
	}
}

ComponentListVladLaz.prototype.createDom = function() {
	var wrapper = document.createElement('div');
	wrapper.className = "vladlaz-task-list";
	this.element = wrapper;
}

ComponentListVladLaz.EventType = {DATA_LOAD: 'tasks/user/list'};
