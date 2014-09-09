var ComponentBase = require('../componentBase');
var ComponentBaseTaskDetail = require('./componentBaseTaskDetail');
var Model = require('../../models/model');
var hrtool = require('../../models/actions');

/*
Object, which contains HTML element for user task detail and other properties and functions inherrited from ComponentTaskDetail object.
Also has variables for storing certain HTML elements that are used in functions of the object. 
*/
var ComponentUserTaskDetail = module.exports = function(taskParams) {
	ComponentBaseTaskDetail.call(this, taskParams);
	this.super = ComponentBaseTaskDetail;
	this.taskId = taskParams.taskId;
	this.textArea = null;
	this.saveNotesBttn = null;
	this.finishTaskBttn = null;
	this.finishTaskBttnNo = null;
	this.finishTaskBttnYes = null;
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

	this.finishTaskBttnNo = document.createElement('button');
	this.finishTaskBttnNo.className = "finish-task-bttn";
	this.finishTaskBttnNo.innerHTML = "No";
	this.finishTaskBttnNo.addEventListener(ComponentBase.EventType.CLICK, this.handleFinishTaskCanceled.bind(this));
	this.finishTaskBttnNo.style.display = "none";
	this.footerWrapper.appendChild(this.finishTaskBttnNo);

	this.finishTaskBttnYes = document.createElement('button');
	this.finishTaskBttnYes.className = "finish-task-bttn";
	this.finishTaskBttnYes.innerHTML = "Yes";
	this.finishTaskBttnYes.addEventListener(ComponentBase.EventType.CLICK, this.handleFinishTaskConfirmed.bind(this));
	this.finishTaskBttnYes.style.display = "none";
	this.footerWrapper.appendChild(this.finishTaskBttnYes);

	this.finishTaskBttn = document.createElement('button');
	this.finishTaskBttn.className = "finish-task-bttn";
	this.finishTaskBttn.innerHTML = "Finish task";
	this.finishTaskBttn.addEventListener(ComponentBase.EventType.CLICK, this.handleFinishTask.bind(this));
	this.footerWrapper.appendChild(this.finishTaskBttn);

	this.saveNotesBttn = document.createElement('button');
	this.saveNotesBttn.className = "save-notes-bttn";
	this.saveNotesBttn.innerHTML = "Save notes";
	this.saveNotesBttn.addEventListener(ComponentBase.EventType.CLICK, this.handleSaveNotes.bind(this));
	this.footerWrapper.appendChild(this.saveNotesBttn);

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
		this.saveNotesBttn.disabled = true;
		this.textArea.readonly = true;
		this.taskNotes = this.textArea.value;

		var dataToSend = {
			id_task: this.taskId,
		 	notes: this.taskNotes
		 };

		var model = new Model (ComponentUserTaskDetail.EventType.DATA_UPDATE);
		this.listen(ComponentUserTaskDetail.EventType.DATA_UPDATE, model, this.saveNotesConfirmed);
		hrtool.actions.updateUserTaskData(model, dataToSend);
	}
}

/*
Function, which will be executed, when saving notes operation is succesfully completed.
*/
ComponentUserTaskDetail.prototype.saveNotesConfirmed = function() {
	this.saveNotesBttn.disabled = false;
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
		this.setButtonsDisplay(true);
	}
}

/*
Function, which handles behavior of the button for confirm the finish of the task.
*/
ComponentUserTaskDetail.prototype.handleFinishTaskConfirmed = function() {
	this.finishTaskBttnYes.disabled = true;
	this.finishTaskBttnNo.disabled = true;

	var dataToSend = {id_task: this.taskId};

	model = new Model (ComponentUserTaskDetail.EventType.TASK_FINISH);
	this.listen(ComponentUserTaskDetail.EventType.TASK_FINISH, model, this.finishTaskOk);
	hrtool.actions.finishUserTask(model, dataToSend);
}

/*
Function, which will be executed, when finishing operation is succesfully completed.
*/
ComponentUserTaskDetail.prototype.finishTaskOk = function() {
	this.finishTaskBttnYes.disabled = false;
	this.finishTaskBttnNo.disabled = false;

	this.setButtonsDisplay(false);

	this.notifications.innerHTML = "Task has been completed.";
	//alert("Task has been completed.");

	this.isFinished = true;
	this.fire(ComponentBase.EventType.CHANGE, this.isFinished); //function for notifying the parrent list of this task detail about finishing
}

/*
Function, which handles behavior of the button for cancel the finish of the task.
*/
ComponentUserTaskDetail.prototype.handleFinishTaskCanceled = function() {
	this.setButtonsDisplay(false);
}

ComponentUserTaskDetail.prototype.setButtonsDisplay = function(display) {
	var a = 'none'
    var b = 'initial'

    if(display == true) {
    	this.finishTaskBttn.style.display = a;
    	this.finishTaskBttnYes.style.display = b;
    	this.finishTaskBttnNo.style.display = b;
    }
    else {
    	this.finishTaskBttn.style.display = b;
    	this.finishTaskBttnYes.style.display = a;
    	this.finishTaskBttnNo.style.display = a;
    }  
}

/*
Function, which handles property read-only of the text area for task description.
*/
ComponentUserTaskDetail.prototype.handleTextAreaEnable = function() {
	this.textArea.readonly = false;
}

ComponentUserTaskDetail.EventType = {DATA_UPDATE: 'tasks/update', TASK_FINISH: 'tasks/finish'};