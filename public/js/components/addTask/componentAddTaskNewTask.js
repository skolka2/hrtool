var ComponentBase = require('../componentBase');
var ComponentCheckBox = require('../features/componentCheckBox');
var ComponentFilterFormatter = require('../features/componentFilterFormatter');
var ComponentFilter = require('../features/componentFilter');
var ComponentDropdown = require('../features/componentDropdown');

var ComponentAddTaskNewTask = module.exports = function() {
    ComponentBase.prototype.constructor.call(this);
    this.super = ComponentBase;
    this._isVisible = true;
    this._filter = null;
    this._status = {
        title: "",
        description: "",
        department_id: -1,
        team_id: -1,
        save_as_template: false
    };
    this._title = null;
    this._text = null;
    this._saveAsNew = new ComponentCheckBox('Save as template', false);
    this.listen(ComponentBase.EventType.CHANGE, this._saveAsNew, this.onChange);
};

ComponentAddTaskNewTask.prototype = new ComponentBase();
ComponentAddTaskNewTask.prototype.constructor = ComponentAddTaskNewTask;

ComponentAddTaskNewTask.prototype.createDom = function() {
    this.element = document.createElement('div');
    this.element.className = 'add-task-wrapper';

    //Header
    var labelDiv = document.createElement('div');
    labelDiv.className = "add-task-header";
    labelDiv.innerText = 'Task';

    //Wrapper of task's title
    var titleDiv = document.createElement("div");

    var taskTitle = document.createElement('span');
    taskTitle.className = "add-task-title-label";
    taskTitle.innerText = "Task title";

    titleDiv.appendChild(taskTitle);
    this._title = document.createElement('input');
    titleDiv.appendChild(this._title);

    //Wrapper of task's text
    var textDiv = document.createElement("div");

    var taskText = document.createElement('span');
    taskText.className = 'add-task-text-label';
    taskText.innerText = 'Task description';

    textDiv.appendChild(taskText);
    this._text = document.createElement('textarea');
    textDiv.appendChild(this._text);

    this._selectorDiv = document.createElement('div');
    this._selectorDiv.className = "add-task-selector";

    this.element.appendChild(labelDiv);
    this.element.appendChild(titleDiv);
    this.element.appendChild(textDiv);
    this.addChild("checkBox_" + this._saveAsNew.componentId, this._saveAsNew, {el: this._selectorDiv});


    var departments = this.helper.bulk.getData(['departments']);
    var teams = this.helper.bulk.getData(['teams']);
    var data = ComponentFilterFormatter.factory.createTeamDropdowns(departments, teams);
    this._filter = new ComponentFilter(data, ['department', 'team']);
    this.element.appendChild(this._selectorDiv);
    this.addChild("filter_" + this._filter.componentId, this._filter, {el: this._selectorDiv});

    this.listen(ComponentDropdown.EventType.CHANGE, this._filter, this.onChange);
};


ComponentAddTaskNewTask.prototype.getStatus = function() {
    if(this._filter !== null) {
        var filterStatus = this._filter.getStatus();
        this._status.department_id = filterStatus.department.id;
        this._status.team_id = filterStatus.team.id;
    }
    this._status.title = this._title.value;
    this._status.description = this._text.value;
    this._status.save_as_template = this._saveAsNew.checked;
    return this._status;
};

ComponentAddTaskNewTask.prototype.onChange = function(data) {
    this.fire(ComponentBase.EventType.CHANGE, this.getStatus());
};