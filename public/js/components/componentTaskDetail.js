/*
Object, which contains HTML element for task detail and other properties and functions inherrited from ComponentBase object.
Also contains variables for storing data about the task. 
*/
var ComponentTaskDetail = function(taskTitle, dateFrom, dateTo, taskDescription, taskNotes, taskBuddy, taskFinished) {
	this.super = ComponentBase;
	this.super.call(this);
	this.taskTitle = taskTitle;
	this.dateFrom = dateFrom;
	this.dateTo = dateTo;
	this.taskDescription = taskDescription;
	this.taskNotes = taskNotes;
	this.taskBuddy = taskBuddy;
	this.isFinished = taskFinished;
}

ComponentTaskDetail.prototype = new ComponentBase();
ComponentTaskDetail.prototype.constructor = ComponentTaskDetail;

/*
Overridden function from component BaseObject - it creates DOM, which will be rendered by other function (render) inherrited from ComponentBase.
*/
ComponentTaskDetail.prototype.createDom = function() {

	var color = this.setTimeColor();

	var taskWrapper = this.helper.dom.createElement('<div class="task-wrapper" style="border: 2px solid; width:1000px;"></div>');

	var headerWrapper = this.helper.dom.createElement('<div class="header-wrapper" clear="none" style="border-bottom: 2px solid; height:50px;"></div>');

	var titleLabel = this.helper.dom.createElement('<label class="task-label">'+this.taskTitle+'</label>');
	headerWrapper.appendChild(titleLabel);

	var timeLabel = this.helper.dom.createElement('<label class="time-label" style="background-color:'+color+'; float:right;"> Timerange: '+this.dateFrom.getDate()+'.'+(this.dateFrom.getMonth()+1)+'.'+this.dateFrom.getFullYear()+' - '+this.dateTo.getDate()+'.'+(this.dateTo.getMonth()+1)+'.'+this.dateTo.getFullYear()+'</label>');
	headerWrapper.appendChild(timeLabel);

	var descriptionWrapper = this.helper.dom.createElement('<div class="description-wrapper" style="height:200px; width:400px; float:left;"></div>');

	var descriptionParagraph = this.helper.dom.createElement('<p class="description-paragraph">Task description: '+this.taskDescription+'</div>');
	descriptionWrapper.appendChild(descriptionParagraph);

	var notesWrapper = this.helper.dom.createElement('<div class="notes-wrapper" style="height:200px; float:left;"></div>');

	var notesText = this.helper.dom.createElement('<textarea class="notes-text"> Task notes: '+this.taskNotes+'</textarea>');
	notesWrapper.appendChild(notesText);

	var footerWrapper = this.helper.dom.createElement('<div class="footer-wrapper" style="border-top: 2px solid; clear:both; height:50px;"></div>');

	var buddyLabel = this.helper.dom.createElement('<label class="buddy-label">'+this.taskBuddy+'</label>');
	footerWrapper.appendChild(buddyLabel);

	var saveNotesBttn = this.helper.dom.createElement('<button class="save-notes" type="button" style="float:right;">Save notes</button>');
	footerWrapper.appendChild(saveNotesBttn);

	var finishTaskBttn = this.helper.dom.createElement('<button class="finish-task" type="button" style="float:right;">Finish task</button>')
	footerWrapper.appendChild(finishTaskBttn);

	taskWrapper.appendChild(headerWrapper);
	taskWrapper.appendChild(descriptionWrapper);
	taskWrapper.appendChild(notesWrapper);
	taskWrapper.appendChild(footerWrapper);

	this.element = taskWrapper; //saving all DOM elements in the element of this object
}

/*
Function for setting up color of the label with time, so it can signalize if deadline on the task has been met.
*/
TaskDetailComponent.prototype.setTimeColor = function() {
	if((this.dateTo < new Date()) && (this.isFinished === false)) {
		return "#FF704D";
	}
	else {
		return "#99FF66";
	}
}

/*
Function for event on button for finishing tasks.
*/
TaskDetailComponent.prototype.finishTask = function() {
	//TO-DO
	alert("Not yet implemented...");
}

/*
Function for event on button for saving user notes.
*/
TaskDetailComponent.prototype.saveNotes = function() {
	//TO-DO
	alert("Not yet implemented...");
}