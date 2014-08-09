/*
Object, which contains HTML element for task detail and other properties and functions inherrited from ComponentBase object.
Also contains variables for storing data about the task. 
*/
var TaskDetailComponent = function(taskTitle, dateFrom, dateTo, taskDescription, taskNotes, taskBuddy, taskFinished) {
	this.super = ComponentBase;
	this.super.call(this);
	this.taskTitle = taskTitle;
	this.dateFrom = dateFrom;
	this.dateTo = dateTo;
	this.taskDescription = taskDescription;
	this.taskNotes = taskNotes;
	this.taskBuddy = taskBuddy;
	this.finished = taskFinished;
}

TaskDetailComponent.prototype = new ComponentBase();
TaskDetailComponent.prototype.constructor = TaskDetailComponent;

/*
Overridden function from component BaseObject - it creates DOM, which will be rendered by other function (render) inherrited from ComponentBase.
*/
TaskDetailComponent.prototype.createDom = function() {

	var color = this.setTimeColor();

	var taskWrapper = helper["elementsFunctions"].createElement('<div class="task-wrapper" style="border: 2px solid; height:20%; width:70%;"></div>');

	var headerWrapper = helper["elementsFunctions"].createElement('<div class="header-wrapper" clear="none" height="20%" style="border-bottom: 2px solid;"></div>');

	var titleLabel = helper["elementsFunctions"].createElement('<label class="task-label" style="float:left;">'+this.taskTitle+'</label>');
	headerWrapper.appendChild(titleLabel);

	var timeLabel = helper["elementsFunctions"].createElement('<label class="time-label" style="background-color:'+color+'; float:right;"> Timerange: '+this.dateFrom.getDate()+'.'+(this.dateFrom.getMonth()+1)+'.'+this.dateFrom.getFullYear()+' - '+this.dateTo.getDate()+'.'+(this.dateTo.getMonth()+1)+'.'+this.dateTo.getFullYear()+'</label>');
	headerWrapper.appendChild(timeLabel);

	var descriptionWrapper = helper["elementsFunctions"].createElement('<div class="description-wrapper" clear="none" height="60%" width="60%"></div>');

	var descriptionParagraph = helper["elementsFunctions"].createElement('<p class="description-paragraph">Task description: '+this.taskDescription+'</div>');
	descriptionWrapper.appendChild(descriptionParagraph);

	var notesWrapper = helper["elementsFunctions"].createElement('<div class="notes-wrapper" clear="none" height="60%" width="60%"></div>');

	var notesText = helper["elementsFunctions"].createElement('<textarea class="notes-text"> Task notes: '+this.taskNotes+'</textarea>');
	notesWrapper.appendChild(notesText);

	var footerWrapper = helper["elementsFunctions"].createElement('<div class="footer-wrapper" clear="none" height="20%" style="border-top: 2px solid;"></div>');

	var buddyLabel = helper["elementsFunctions"].createElement('<label class="buddy-label" style="float:left;">'+this.taskBuddy+'</label>');
	footerWrapper.appendChild(buddyLabel);

	var saveNotesBttn = helper["elementsFunctions"].createElement('<button class="save-notes" type="button" style="float:right;">Save notes</button>');
	footerWrapper.appendChild(saveNotesBttn);

	var finishTaskBttn = helper["elementsFunctions"].createElement('<button class="finish-task" type="button" style="float:right;">Finish task</button>')
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
	if((this.dateTo < new Date()) && (this.finished === false)) {
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