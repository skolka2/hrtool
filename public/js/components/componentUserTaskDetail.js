/*
Object, which contains HTML element for user task detail and other properties and functions inherrited from ComponentTaskDetail object.
Also has variables for storing certain HTML elements that are used in functions of the object. 
*/
var ComponentUserTaskDetail = function(taskParams) {
	ComponentBaseTaskDetail.call(this, taskParams);
	this.super = ComponentBaseTaskDetail;
	this.taskId = taskParams.taskId;
	this.textArea = null;
	this.saveNotesB = null;
	this.finishTaskB = null;
	this.finishTaskBNo = null;
	this.finishTaskBYes = null;
	this.notifications = null;
}

ComponentUserTaskDetail.prototype = Object.create(ComponentBaseTaskDetail.prototype);
ComponentUserTaskDetail.prototype.constructor = ComponentUserTaskDetail;

/*
Overridden function from component BaseObject - it creates DOM, which will be rendered by other function (render) inherrited from ComponentBase.
*/
ComponentUserTaskDetail.prototype.createDom = function() {
	this.super.prototype.createDom.apply(this);

	this.headerWrapper.removeChild(this.buddyLabel);
	this.notesWrapper.removeChild(this.notesText);

	this.textArea = this.helper.dom.createElement('<textArea class="notes-text-area">'+this.taskNotes+'</textArea>');
	this.textArea.addEventListener(ComponentBase.EventType.CLICK, this.handleTextAreaEnable.bind(this));
	this.textArea.readonly = true;
	this.notesWrapper.appendChild(this.textArea);

	this.footerWrapper.appendChild(this.buddyLabel);

	this.finishTaskBNo = document.createElement('button');
	this.finishTaskBNo.className = "finish-task-bttn";
	this.finishTaskBNo.innerHTML = "No";
	this.finishTaskBNo.addEventListener(ComponentBase.EventType.CLICK, this.handleFinishTaskCanceled.bind(this));
	this.finishTaskBNo.style.display = "none";
	this.footerWrapper.appendChild(this.finishTaskBNo);

	this.finishTaskBYes = document.createElement('button');
	this.finishTaskBYes.className = "finish-task-bttn";
	this.finishTaskBYes.innerHTML = "Yes";
	this.finishTaskBYes.addEventListener(ComponentBase.EventType.CLICK, this.handleFinishTaskConfirmed.bind(this));
	this.finishTaskBYes.style.display = "none";
	this.footerWrapper.appendChild(this.finishTaskBYes);

	this.finishTaskB = document.createElement('button');
	this.finishTaskB.className = "finish-task-bttn";
	this.finishTaskB.innerHTML = "Finish task";
	this.finishTaskB.addEventListener(ComponentBase.EventType.CLICK, this.handleFinishTask.bind(this));
	this.footerWrapper.appendChild(this.finishTaskB);

	this.saveNotesB = document.createElement('button');
	this.saveNotesB.className = "save-notes-bttn";
	this.saveNotesB.innerHTML = "Save notes";
	this.saveNotesB.addEventListener(ComponentBase.EventType.CLICK, this.handleSaveNotes.bind(this));
	this.footerWrapper.appendChild(this.saveNotesB);

	this.notifications = document.createElement('div');
	this.notifications.className = "notification-div";
	this.footerWrapper.appendChild(this.notifications);

	this.element = this.taskWrapper; //saving all DOM elements in the element of this object
}

/*
Function, which handles behavior of the button for saving task notes.
*/
ComponentUserTaskDetail.prototype.handleSaveNotes = function() {
	if(this.textArea.value === this.taskNotes) {
		this.notifications.innerHTML = "Nothing has been changed.";
		//alert("Nothing has been changed.");
	}
	else {
		this.saveNotesB.disabled = true;
		this.textArea.readonly = true;
		this.taskNotes = this.textArea.value;

		var dataToSend = {
			id_task: this.taskId,
		 	notes: this.taskNotes
		 };

		this.model = new Model (ComponentUserTaskDetail.EventType.DATA_UPDATE);
		this.listen(ComponentUserTaskDetail.EventType.DATA_UPDATE, this.model, this.saveNotesConfirmed);
		hrtool.actions.updateUserTaskData(this.model, dataToSend);
	}
}

/*
Function, which will be executed, when saving notes operation is succesfully completed.
*/
ComponentUserTaskDetail.prototype.saveNotesConfirmed = function() {
	this.saveNotesB.disabled = false;
	this.notifications.innerHTML = "Save succesfull.";
	//alert("Save succesfull.");
}

/*
Function, which handles behavior of the button for finishing task.
*/
ComponentUserTaskDetail.prototype.handleFinishTask = function() {
	if(this.isFinished) {
		this.notifications.innerHTML = "Already completed.";
		//alert("Already completed.");
	}
	else {
		this.finishTaskB.style.display = "none";
		this.finishTaskBYes.style.display = "initial";
		this.finishTaskBNo.style.display = "initial";
	}
}

/*
Function, which handles behavior of the button for confirm the finish of the task.
*/
ComponentUserTaskDetail.prototype.handleFinishTaskConfirmed = function() {
	this.finishTaskBYes.disabled = true;
	this.finishTaskBNo.disabled = true;

	var dataToSend = {id_task: this.taskId};

	this.model = new Model (ComponentUserTaskDetail.EventType.TASK_FINISH);
	this.listen(ComponentUserTaskDetail.EventType.TASK_FINISH, this.model, this.finishTaskOk);
	hrtool.actions.finishUserTask(this.model, dataToSend);
}

/*
Function, which will be executed, when finishing operation is succesfully completed.
*/
ComponentUserTaskDetail.prototype.finishTaskOk = function() {
	this.finishTaskBYes.disabled = false;
	this.finishTaskBNo.disabled = false;

	this.finishTaskB.style.display = "initial";
	this.finishTaskBYes.style.display = "none";
	this.finishTaskBNo.style.display = "none";

	this.notifications.innerHTML = "Task has been completed.";
	//alert("Task has been completed.");

	this.isFinished = true;
	this.fire(ComponentBase.EventType.CHANGE, this.isFinished); //function for notifying the parrent list of this task detail about finishing
}

/*
Function, which handles behavior of the button for cancel the finish of the task.
*/
ComponentUserTaskDetail.prototype.handleFinishTaskCanceled = function() {
	this.finishTaskB.style.display = "initial";
	this.finishTaskBYes.style.display = "none";
	this.finishTaskBNo.style.display = "none";
}

/*
Function, which handles property read-only of the text area for task description.
*/
ComponentUserTaskDetail.prototype.handleTextAreaEnable = function() {
	this.textArea.readonly = false;
}

ComponentUserTaskDetail.EventType = {DATA_UPDATE: 'tasks/update', TASK_FINISH: 'tasks/finish'};