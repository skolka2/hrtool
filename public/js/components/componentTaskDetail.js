/*
Object, which contains HTML element for task detail and other properties and functions inherrited from ComponentBase object.
Also contains variables for storing data about the task. 
*/
var ComponentTaskDetail = function(taskParams) {
	this.super = ComponentBase;
	this.super.call(this);
	this.taskBuddy = taskParams.task_buddy; //String
	this.taskTitle = taskParams.task_title; //String
	this.dateFrom = new Date(taskParams.date_from); //Date
	this.dateTo = new Date(taskParams.date_to); //Date
	this.taskDescription = taskParams.task_description; //String
	this.taskNotes = taskParams.task_notes; //String
	this.isFinished = taskParams.task_finished; //Boolean
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

	var buddyLabel = this.helper.dom.createElement('<label class="task-label" style="margin-right:50px;">'+this.taskBuddy+'</label>');
	headerWrapper.appendChild(buddyLabel);

	var titleLabel = this.helper.dom.createElement('<label class="task-label">'+this.taskTitle+'</label>');
	headerWrapper.appendChild(titleLabel);

	var timeLabel = this.helper.dom.createElement('<label class="time-label" style="background-color:'+color+'; float:right;"> Timerange: '+this.dateFrom.getDate()+'.'+(this.dateFrom.getMonth()+1)+'.'+this.dateFrom.getFullYear()+' - '+this.dateTo.getDate()+'.'+(this.dateTo.getMonth()+1)+'.'+this.dateTo.getFullYear()+'</label>');
	headerWrapper.appendChild(timeLabel);

	var descriptionWrapper = this.helper.dom.createElement('<div class="description-wrapper" style="height:200px; width:300px; float:left;"></div>');

	var descriptionParagraph = this.helper.dom.createElement('<p class="description-paragraph">Task description: '+this.taskDescription+'</p>');
	descriptionWrapper.appendChild(descriptionParagraph);

	var notesWrapper = this.helper.dom.createElement('<div class="notes-wrapper" style="height:200px; border-left: 2px solid; float:left;"></div>');

	var notesText = this.helper.dom.createElement('<p class="notes-text"> Task notes: '+this.taskNotes+'</p>');
	notesWrapper.appendChild(notesText);

	var footerWrapper = this.helper.dom.createElement('<div class="footer-wrapper" style="border-top: 2px solid; clear:both; height:50px;"></div>');

	taskWrapper.appendChild(headerWrapper);
	taskWrapper.appendChild(descriptionWrapper);
	taskWrapper.appendChild(notesWrapper);
	taskWrapper.appendChild(footerWrapper);

	this.element = taskWrapper; //saving all DOM elements in the element of this object
}

/*
Function for setting up color of the label with time, so it can signalize if deadline on the task has been met.
*/
ComponentTaskDetail.prototype.setTimeColor = function() {
	if((this.dateTo < new Date()) && (this.isFinished === false)) {
		return "#FF704D";
	}
	else {
		return "#99FF66";
	}
}