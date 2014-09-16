var ComponentBase = require('../componentBase');
var ComponentAddTaskNewTask = require('./componentAddTaskNewTask');
var ComponentTaskTemplate = require('./componentTasksTemplate');
var ComponentTabbedArea = require('../features/componentTabbedArea');
var ComponentFilterFormatter = require('../features/componentFilterFormatter');
var ComponentFilter = require('../features/componentFilter');
var ComponentDropDown = require('../features/componentDropdown');
var Model = require('../../models/model');
var hrtool = require('../../models/actions');
var Const = require('../../helpers/constants');


var ComponentAddTask = function() {
    ComponentBase.prototype.constructor.call(this);
    this.super = ComponentBase;
    this._leftComponent = new ComponentAddTaskNewTask();
    this._rightComponent = new ComponentTaskTemplate();
    this._tabbedAreaComponent = new ComponentTabbedArea(
        ['New task', 'Choose template'],
        [[this._leftComponent], [this._rightComponent]]);

    this.setModel(new Model(ComponentAddTask.EventType.GET_DATA), ComponentAddTask.EventType.GET_DATA);
    hrtool.actions.getUsers(this.model);

    this.taskModel = new Model(ComponentAddTask.EventType.INSERT_NEW_TASK);
    this.listen(ComponentAddTask.EventType.INSERT_NEW_TASK, this.taskModel, this.onSave);

    this.templateModel = new Model(ComponentAddTask.EventType.INSERT_NEW_TEMPLATE);
    this.listen(ComponentAddTask.EventType.INSERT_NEW_TEMPLATE, this.templateModel, this.onSave);
};

ComponentAddTask.prototype = Object.create(ComponentBase.prototype);
ComponentAddTask.constructor = ComponentAddTask;



ComponentAddTask.prototype.onLoad = function(data){
    var departments = this.helper.bulk.getData(['departments']);
    var teams = this.helper.bulk.getData(['teams']);
    var users = {};
    var buddies = {};
    var id;
    for(var i = 0; i < data.length; i++){
        id = this.helper.obj.getData(data[i], ['id_user']);
        buddies[id] = data[i];
        id += '-' + this.helper.obj.getData(data[i], ['id_team']);
        users[id] = data[i];
    }
    var data2 = ComponentFilterFormatter.factory.createNewTaskDropdowns(departments, teams, users);
    this._componentFilter = new ComponentFilter(data2, ['department', 'team', 'user', 'buddy']);
    this.addChild('componentFilter', this._componentFilter, {el: this._personWrapper});
    this._componentFilter.render(this._personWrapper);

    buddies = ComponentFilterFormatter.transform(buddies, 'id_user', 'email'); 
    this._buddyDropdown = new ComponentDropDown(buddies['']);
    this.addChild('buddyDropdown', this._buddyDropdown, {el: this._personWrapper});
    this._buddyDropdown.render(this._personWrapper);
};


ComponentAddTask.prototype.onSave = function(data){
    if(!data){
        console.log('Problém s ukládáním do databáze');
    }
};






ComponentAddTask.prototype.createDom = function(){
    this.element = document.createElement('div');
    this.element.className = ComponentAddTask.WRAPPER_CLASS;

    this._personWrapper = document.createElement('div');
    this._personWrapper.className = ComponentAddTask.PERSON_WRAPPER_CLASS;
    var span = document.createElement('span');
    span.innerHTML = 'Person:';
    this._personWrapper.appendChild(span);
    this.element.appendChild(this._personWrapper);

    var tabbedAreaDiv = document.createElement('div');
    this.element.appendChild(tabbedAreaDiv);
    this.addChild('tabbedArea', this._tabbedAreaComponent, {el: tabbedAreaDiv});

    var dateWrapper = document.createElement('div');
    dateWrapper.className = ComponentAddTask.DATE_WRAPPER_CLASS;

    span = document.createElement('span');
    span.innerHTML = 'Task starts at:';
    dateWrapper.appendChild(span);
    this._dateInput = document.createElement('input');
    this._dateInput.type = 'date';
    var date = new Date();
    var month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var today = date.getFullYear() + '-' + month + '-' + day;
    this._dateInput.min = today;
    this._dateInput.value = today;
    dateWrapper.appendChild(this._dateInput);

    span = document.createElement('span');
    span.innerHTML = 'Task length (days):';
    dateWrapper.appendChild(span);
    this._lengthInput = document.createElement('input');
    this._lengthInput.type = 'number';
    this._lengthInput.min = 1;
    this._lengthInput.value = 1;
    dateWrapper.appendChild(this._lengthInput);
    this.element.appendChild(dateWrapper);

    var saveBT = document.createElement('button');
    saveBT.innerHTML = 'Save';
    saveBT.addEventListener('click', this.handleClickEvent.bind(this), false);
    this.element.appendChild(saveBT);
};





ComponentAddTask.prototype.handleClickEvent = function(){
    var userStatus = this._componentFilter.getStatus();
    if(userStatus.department.id === -1 || userStatus.team.id === -1 || userStatus.user.id === -1 || this._buddyDropdown.selected.id === -1){
        console.log('Chybí nějaký id u osoby a buddyho');
        return;
    }
    if(!Number(this._lengthInput.value)){
        console.log('Délka musí být číslo');
        return;
    }
    if(userStatus.user.id === this._buddyDropdown.selected.id){
        console.log('User a Buddy je stejnej');
        return;
    }


    var selectedTab = this._tabbedAreaComponent.getSelectedTabNumber();
    var taskStatus = {};
    var title, description, team, department;
    var saveAsTemplate = false;
    var dateFrom = new Date(this._dateInput.value);
    var dateTo = new Date(dateFrom.getTime() + (Number(this._lengthInput.value) * Const.milisPerDay)).toDateString();

    switch(selectedTab){
        case 0 :    //new task is inserted
            taskStatus = this._leftComponent.getStatus();
            title = taskStatus.title;
            description = taskStatus.description;
            if(title === '' || description === ''){
                console.log('title a description nesmí být null');
                return;
            }
            team = taskStatus.team_id;
            department = taskStatus.department_id;
            if(team === -1 || department === -1){
                console.log('není vybrán department nebo team nového tasku');
                return;
            }
            saveAsTemplate = taskStatus.save_as_template;
            break;
        case 1 :    //task template is chosen
            taskStatus = this._rightComponent.getStatus();
            if(taskStatus.task_template.id === -1){
                console.log('není správně vybrána templata');
                return;
            }
            var template = this._rightComponent.getSelectedTemplate(taskStatus.task_template.id);
            title = template.title;
            description = template.description;
            team = template.id_team;
            department = template.id_department;
            break;
    }

    var newTask = {
        title : title,
        description: description,
        id_team : team,
        id_department: department,
        id_user: userStatus.user.id,
        id_buddy: userStatus.buddy.id,
        date_from: this._dateInput.value,
        date_to: dateTo
    };
    hrtool.actions.insertNewTask(this.taskModel, newTask);
    if(saveAsTemplate){
        var newTemplate = {
            title: title,
            description: description,
            id_team: team,
            id_department: department
        };
        hrtool.actions.insertNewTemplate(this.templateModel, newTemplate);
    }
};











ComponentAddTask.WRAPPER_CLASS = 'new-task-wrapper';
ComponentAddTask.PERSON_WRAPPER_CLASS = 'new-task-person-wrapper';
ComponentAddTask.DATE_WRAPPER_CLASS = 'new-task-date-wrapper';

ComponentAddTask.EventType = {
    GET_DATA : 'user/get-all',
    INSERT_NEW_TEMPLATE: 'template/insert',
    INSERT_NEW_TASK: 'tasks/insert'
};

module.exports = ComponentAddTask;