var ComponentBase = require('../../../componentBase');
var ComponentAddTaskNewTask = require('./componentAddTaskNewTask');
var ComponentTaskTemplate = require('./componentTasksTemplate');
var ComponentTabbedArea = require('../../componentTabbedArea');
var ComponentFilterFormatter = require('../../componentFilterFormatter');
var ComponentFilter = require('../../componentFilter');
var ComponentDropdown = require('../../componentDropdown');
var Model = require('../../../../models/model');
var hrtool = require('../../../../models/actions');
var Const = require('../../../../helpers/constants');
var NotificationCenter = require('../../componentNotificationCenter');


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
    this._componentFilter = new ComponentFilter(data2, ['department', 'team', 'user'], [false, false, true]);
    this.addChild('componentFilter', this._componentFilter, {el: this._personWrapper});
    this._componentFilter.render(this._personWrapper);
    this.listen(ComponentDropdown.EventType.CHANGE, this._componentFilter, this.handleDropdownChange);

    buddies = ComponentFilterFormatter.transform(buddies, 'id_user', 'full_name');
    this._buddyDropdown = new ComponentDropdown(buddies[''], true);
    this.addChild('buddyDropdown', this._buddyDropdown, {el: this._personWrapper});
    this._buddyDropdown.render(this._personWrapper);
};


ComponentAddTask.prototype.onSave = function(data){
    if(!data){
        this.addNotification(document.createTextNode('Something messed up durind saving!'),
            ComponentAddTask.NotificationDuration, NotificationCenter.EventType.error);
    }else{
        this.addNotification(document.createTextNode('Saving was successful!'),
            ComponentAddTask.NotificationDuration, NotificationCenter.EventType.success);
    }
};









ComponentAddTask.prototype.createDom = function(){
    this.element = document.createElement('div');
    this.element.className = ComponentAddTask.WRAPPER_CLASS;
    this.element.addEventListener('click', this.handleClickEvent.bind(this), false);

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
    saveBT.addEventListener('click', this.handleSaveClickEvent.bind(this), false);
    this.element.appendChild(saveBT);
};





ComponentAddTask.prototype.handleSaveClickEvent = function(){
    var userStatus = this._componentFilter.getStatus();
    if(userStatus.department.id === -1 || userStatus.team.id === -1 || userStatus.user.id === -1 || this._buddyDropdown.selected.id === -1){
        this.addNotification(document.createTextNode('User or task buddy wasn\'t chosen correctly!'),
            ComponentAddTask.NotificationDuration, NotificationCenter.EventType.error);
        return;
    }

    if(userStatus.user.id === this._buddyDropdown.selected.id){
        this.addNotification(document.createTextNode('User and task buddy cannot be the same person!'),
            ComponentAddTask.NotificationDuration, NotificationCenter.EventType.error);
        return;
    }

    var selectedTab = this._tabbedAreaComponent.getSelectedTabNumber();
    var taskStatus = {};
    var team = userStatus.team.id;
    var department = userStatus.department.id;
    var saveAsTemplate = false;
    var length = this._lengthInput.value;
    var dateFrom = new Date(this._dateInput.value);
    var goodFill = this.checkInputs(this._leftComponent.getStatus().title, this._leftComponent.getStatus().description,
        dateFrom, length, selectedTab);
    var title, description, template_team, template_department;

    if(!goodFill){
        this.addNotification(document.createTextNode('You have to fill all inputs of new task correctly!'),
            ComponentAddTask.NotificationDuration, NotificationCenter.EventType.error);
        return;
    }

    var dateTo = new Date(dateFrom.getTime() + (Number(length) * Const.milisPerDay)).toDateString();

    switch(selectedTab){
        case 0 :    //new task is inserted
            taskStatus = this._leftComponent.getStatus();
            title = taskStatus.title;
            description = taskStatus.description;
            saveAsTemplate = taskStatus.save_as_template;
            template_team = taskStatus.team_id;
            template_department = taskStatus.department_id;
            if(saveAsTemplate && (template_team === -1 || template_department === -1)){
                this.addNotification(document.createTextNode('You have to pick department and team of new task!'),
                    ComponentAddTask.NotificationDuration, NotificationCenter.EventType.error);
                return;
            }
            break;
        case 1 :    //task template is chosen
            taskStatus = this._rightComponent.getStatus();
            if(taskStatus.task_template.id === -1){
                this.addNotification(document.createTextNode('Template wasn\'t picked correctly!'),
                    ComponentAddTask.NotificationDuration, NotificationCenter.EventType.error);
                return;
            }
            var template = this._rightComponent.getSelectedTemplate(taskStatus.task_template.id);
            title = template.title;
            description = template.description;
            template_team = template.id_team;
            template_department = template.id_department;
            break;
    }

    if(saveAsTemplate && selectedTab === 0){
        hrtool.actions.insertNewTemplate(this.templateModel, {
            title: title,
            description: description,
            id_team: template_team,
            id_department: template_department
        });
    }

    hrtool.actions.insertNewTask(this.taskModel, {
        title : title,
        description: description,
        id_team : team,
        id_department: department,
        id_user: userStatus.user.id,
        id_buddy: this._buddyDropdown.selected.id,
        date_from: this._dateInput.value,
        date_to: dateTo
    });
};




ComponentAddTask.prototype.checkInputs = function(title, description, dateFrom, length, selectedTab){
    var ret = true;
    var now = new Date();
    if(dateFrom == 'Invalid Date' || dateFrom.getFullYear() < now.getFullYear() || dateFrom.getMonth() < now.getMonth()
        || dateFrom.getDate() < now.getDate()){
        this._dateInput.className = 'invalid-input';
        ret = false;
    }else{
        this._dateInput.className = null;
    }

    if (title === '' && selectedTab === 0) {
        this._leftComponent._title.className = 'invalid-input';
        ret = false;
    }else {
        this._leftComponent._title.className = null;
    }

    if (description === '' && selectedTab === 0) {
        this._leftComponent._text.className = 'invalid-input';
        ret = false;
    }else {
        this._leftComponent._text.className = null
    }

    if(!Number(length)){
        this._lengthInput.className = 'invalid-input';
        ret = false;
    }else{
        this._lengthInput.className = null;
    }
    return ret;
};



ComponentAddTask.prototype.handleClickEvent = function(e){
    var type = e.srcElement.type;
    if(type === 'text' || type === 'textarea' || type === 'number' || type === 'date'){
        if(e.srcElement.className === 'invalid-input'){
            e.srcElement.className = null;
        }
    }
};


ComponentAddTask.prototype.handleDropdownChange = function(selection){
    var dropdown;
    switch(selection.value){
        case this._componentFilter._dropdowns[0].selected.value :
            dropdown = this._leftComponent._filter._dropdowns[0];
            break;
        case this._componentFilter._dropdowns[1].selected.value :
            dropdown = this._leftComponent._filter._dropdowns[1];
            break;
    }
    if(!dropdown) return;

    for(var i = 0; i < dropdown._map.length; i++){
        if(dropdown._map[i].value.value === selection.value){
            dropdown.setSelection(dropdown._map[i].value);
        }
    }

    this._leftComponent._filter.setActive(this._leftComponent._saveAsNew.checked);
};




ComponentAddTask.WRAPPER_CLASS = 'new-task-wrapper';
ComponentAddTask.PERSON_WRAPPER_CLASS = 'new-task-person-wrapper';
ComponentAddTask.DATE_WRAPPER_CLASS = 'new-task-date-wrapper';

ComponentAddTask.EventType = {
    GET_DATA : 'user/get-all',
    INSERT_NEW_TEMPLATE: 'template/insert',
    INSERT_NEW_TASK: 'tasks/insert'
};

ComponentAddTask.NotificationDuration = 3000;

module.exports = ComponentAddTask;