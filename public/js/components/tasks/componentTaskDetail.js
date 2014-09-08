var ComponentBase = require('../componentBase');
var helper = require('../../helpers/helpers');



/*
Object, which contains HTML element for task detail and other properties and functions inherrited from ComponentBase object.
Also contains variables for storing data about the task. 
*/
var ComponentTaskDetail =  module.exports = function(taskParams) {
	ComponentBase.call(this);
	this.super = ComponentBase;
	this.taskBuddy = taskParams.taskBuddy; //String
	this.taskTitle = taskParams.taskTitle; //String
	this.dateFrom = new Date(taskParams.dateFrom); //Date
	this.dateTo = new Date(taskParams.dateTo); //Date
	this.taskDescription = taskParams.taskDescription; //String
	this.taskNotes = taskParams.taskNotes; //String
	this.isFinished = taskParams.isFinished; //Boolean
}

ComponentTaskDetail.prototype = new ComponentBase();
ComponentTaskDetail.prototype.constructor = ComponentTaskDetail;

/*
Overridden function from component BaseObject - it creates DOM, which will be rendered by other function (render) inherrited from ComponentBase.
*/
ComponentTaskDetail.prototype.createDom = function() {

	var taskWrapper = document.createElement('div');
	taskWrapper.className = "task-wrapper";

	var headerWrapper = document.createElement('div');
	headerWrapper.className = "header-wrapper";

	var buddyLabel = this.helper.dom.createElement('<label class="buddy-label">'+this.taskBuddy+'</label>');
	headerWrapper.appendChild(buddyLabel);

	var titleLabel = this.helper.dom.createElement('<label class="task-label">'+this.taskTitle+'</label>');
	headerWrapper.appendChild(titleLabel);

	var timeLabel = this.helper.dom.createElement('<label> Timerange: '+this.dateFrom.getDate()+'.'+(this.dateFrom.getMonth()+1)+'.'+this.dateFrom.getFullYear()+' - '+this.dateTo.getDate()+'.'+(this.dateTo.getMonth()+1)+'.'+this.dateTo.getFullYear()+'</label>');

	if((this.dateTo < new Date()) && (this.isFinished === false)) {
		timeLabel.className = "time-label-overflow";
	}
	else {
		timeLabel.className = "time-label";
	}

	headerWrapper.appendChild(timeLabel);

	var descriptionWrapper = document.createElement('div');
	descriptionWrapper.className = "description-wrapper";

	var descriptionParagraph = this.helper.dom.createElement('<p class="description-paragraph">Task description: '+this.taskDescription+'</p>');
	descriptionWrapper.appendChild(descriptionParagraph);

	var notesWrapper = document.createElement('div');
	notesWrapper.className = "notes-wrapper";

	var notesText = this.helper.dom.createElement('<p class="notes-text"> Task notes: '+this.taskNotes+'</p>');
	notesWrapper.appendChild(notesText);

	var footerWrapper = document.createElement('div');
	footerWrapper.className = "footer-wrapper";

	taskWrapper.appendChild(headerWrapper);
	taskWrapper.appendChild(descriptionWrapper);
	taskWrapper.appendChild(notesWrapper);
	taskWrapper.appendChild(footerWrapper);

	this.element = taskWrapper; //saving all DOM elements in the element of this object
}