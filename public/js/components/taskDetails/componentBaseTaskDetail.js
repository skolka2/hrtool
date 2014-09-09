var ComponentBase = require('../componentBase');

/*
Object, which contains HTML element for task detail and other properties and functions inherrited from ComponentBase object.
Also contains variables for storing data about the task. 
*/
var ComponentBaseTaskDetail = module.exports = function(taskParams) {
	ComponentBase.call(this);
	this.super = ComponentBase;
	this.taskBuddy = taskParams.taskBuddy; //String
	this.taskTitle = taskParams.taskTitle; //String
	this.dateFrom = new Date(taskParams.dateFrom); //Date
	this.dateTo = new Date(taskParams.dateTo); //Date
	this.taskDescription = taskParams.taskDescription; //String
	this.taskNotes = taskParams.taskNotes; //String
	this.isFinished = taskParams.isFinished; //Boolean
	this.taskWrapper = null;
	this.headerWrapper = null;
	this.buddyLabel = null;
	this.titleLabel = null;
	this.timeLabel = null;
	this.descriptionWrapper = null;
	this.descriptionParagraph = null;
	this.notesWrapper = null;
	this.notesText = null;
	this.footerWrapper = null;
}

ComponentBaseTaskDetail.prototype = new ComponentBase();
ComponentBaseTaskDetail.prototype.constructor = ComponentBaseTaskDetail;

/*
Overridden function from component BaseObject - it creates DOM, which will be rendered by other function (render) inherrited from ComponentBase.
*/
ComponentBaseTaskDetail.prototype.createDom = function() {

	this.taskWrapper = document.createElement('div');
	this.taskWrapper.className = "task-wrapper";

	if((this.dateTo < new Date()) && (this.isFinished === false)) {
		this.taskWrapper.className = "task-wrapper-overflow";
	}
	else {
		this.taskWrapper.className = "task-wrapper";
	}

	this.headerWrapper = document.createElement('div');
	this.headerWrapper.className = "header-wrapper";

	this.buddyLabel = this.helper.dom.createElement('<span class="buddy-label">'+this.taskBuddy+'</span>');
	this.headerWrapper.appendChild(this.buddyLabel);

	this.titleLabel = this.helper.dom.createElement('<span class="task-label">'+this.taskTitle+'</span>');
	this.headerWrapper.appendChild(this.titleLabel);

	this.timeLabel = this.helper.dom.createElement('<span> Timerange: '+this.helper.format.getDate(this.dateFrom)+' - '+this.helper.format.getDate(this.dateTo)+'</span>');
	this.timeLabel.className = "time-label-overflow";
	this.headerWrapper.appendChild(this.timeLabel);

	this.descriptionWrapper = document.createElement('div');
	this.descriptionWrapper.className = "description-wrapper";

	this.descriptionParagraph = this.helper.dom.createElement('<p class="description-paragraph">Task description: '+this.taskDescription+'</p>');
	this.descriptionWrapper.appendChild(this.descriptionParagraph);

	this.notesWrapper = document.createElement('div');
	this.notesWrapper.className = "notes-wrapper";

	this.notesText = this.helper.dom.createElement('<p class="notes-text"> Task notes: '+this.taskNotes+'</p>');
	this.notesWrapper.appendChild(this.notesText);

	this.footerWrapper = document.createElement('div');
	this.footerWrapper.className = "footer-wrapper";

	this.taskWrapper.appendChild(this.headerWrapper);
	this.taskWrapper.appendChild(this.descriptionWrapper);
	this.taskWrapper.appendChild(this.notesWrapper);
	this.taskWrapper.appendChild(this.footerWrapper);

	this.element = this.taskWrapper; //saving all DOM elements in the element of this object
}