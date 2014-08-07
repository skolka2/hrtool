/*
Object, which contains HTML element for task detail and other properties and functions inherrited from ComponentBase object.
Also contains variables for storing data about the task. 
*/
var TaskDetailComponent = function() {
	this.super = ComponentBase;
	this.super.call(this);
	this.taskTitle = '';
	this.dateFrom = null;
	this.dateTo = null;
	this.taskTescription = '';
	this.taskNotes = '';
	this.finished = false;
}

TaskDetailComponent.prototype = new ComponentBase();
TaskDetailComponent.prototype.constructor = TaskDetailComponent;

/*
Overridden function from component BaseObject - it creates DOM, which will be rendered by other function (render) inherrited from ComponentBase.
*/
TaskDetailComponent.prototype.createDom = function() {

	var divWrapper = document.createElement("div"); //wrapper of other elements

	var taskTable = document.createElement("table"); //table of the task detail element
	taskTable.setAttribute("width","1024px");
	taskTable.setAttribute("height","300px");
	taskTable.setAttribute("border","1");

	var titleRow = document.createElement("tr"); //row with title and dates of the task
	titleRow.setAttribute("height","20%");

	var titleCol = document.createElement("td"); //column with title of the task
	titleCol.setAttribute("width","80%");
	titleCol.setAttribute("colspan","2");
	titleCol.innerHTML = "title";

	var dateCol = document.createElement("td"); //column with timerange of the task
	dateCol.setAttribute("width","20%");
	dateCol.innerHTML = "timerange: "

	titleRow.appendChild(titleCol);
	titleRow.appendChild(dateCol);
	taskTable.appendChild(titleRow);

	var middleRow = document.createElement("tr"); //row with description and user notes of the task
	middleRow.setAttribute("height","60%");

	var descriptionCol = document.createElement("td"); //column with description of the task
	descriptionCol.setAttribute("width","40%");
	descriptionCol.innerHTML = "description";

	var notesCol = document.createElement("td"); //column with user notes of the task
	notesCol.setAttribute("width","60%");
	notesCol.setAttribute("colspan","2");
	notesCol.innerHTML = "notes";

	middleRow.appendChild(descriptionCol);
	middleRow.appendChild(notesCol);
	taskTable.appendChild(middleRow);

	var buttonRow = document.createElement("tr"); //row with buttons for changing the property of the task
	buttonRow.setAttribute("height","20%");

	var buttonCol = document.createElement("td"); //column with buttons for changing the property of the task
	buttonCol.setAttribute("colspan","3");
	buttonCol.setAttribute("align","right");

	var notesButton = document.createElement("button"); //button for saving user notes of the task
	notesButton.setAttribute("type","button");
	notesButton.innerHTML = "Save notes";

	var completeButton = document.createElement("button"); //button for flaging task as finished
	completeButton.setAttribute("type","button");
	completeButton.innerHTML = "Finish task"

	buttonCol.appendChild(notesButton);
	buttonCol.appendChild(completeButton);
	buttonRow.appendChild(buttonCol);
	taskTable.appendChild(buttonRow);

	divWrapper.appendChild(taskTable);

	this.element = divWrapper; //saving all DOM elements in the element of this object
}