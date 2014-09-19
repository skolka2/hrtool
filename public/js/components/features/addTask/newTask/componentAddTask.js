var ComponentBase = require('../../../componentBase');
var ComponentLeft = require('./componentLeft');
var ComponentRight = require('./componentRight');
var ComponentTabbedArea = require('../../componentTabbedArea');
var ComponentFilterFormatter = require('../../componentFilterFormatter');
var ComponentFilter = require('../../componentFilter');
var ComponentDropdown = require('../../componentDropdown');
var Model = require('../../../../models/model');
var hrtool = require('../../../../models/actions');
var Const = require('../../../../helpers/constants');
var NotificationCenter = require('../../../componentNotificationCenter');


var ComponentAddTask = function() {
    ComponentBase.prototype.constructor.call(this);
    this.super = ComponentBase;
    this._leftComponent = new ComponentLeft();
    this._rightComponent = new ComponentRight();
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
    var departments = this.helper.bulk.getDepartmentData();
    var teams = this.helper.bulk.getTeamData();
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
    if(data.name && data.name === 'error'){
        this.addNotification(document.createTextNode('Something messed up during saving!\n error code: ' +
            this.helper.obj.getData(data, ['code'])), ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
    }else{
        this.addNotification(document.createTextNode('Saving was successful!'),
            ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.success);
    }
};


ComponentAddTask.prototype.createDom = function(){
    var today = this.helper.format.getDateInputFormat(new Date());
    var jadeData = {
        today: today,
        personTitle: 'Person:',
        dateTitle: 'Task starts at:',
        dateInputClass: this.componentId + '-date-input',
        dateLabelClass: 'date-label',
        taskLengthTitle: 'Task length (days):',
        taskLengthInputClass: this.componentId + '-length-input',
        taskLengthLabelClass: 'task-length-label',
        saveButtonClass: this.componentId + '-save-button',
        saveButtonTitle: 'Save',
        wrapperClass: ComponentAddTask.WRAPPER_CLASS,
        personWrapperClass: ComponentAddTask.PERSON_WRAPPER_CLASS,
        bottomWrapperClass: ComponentAddTask.BOTTOM_WRAPPER_CLASS
    };

    this.element = this.helper.tpl.create('components/features/addTask/newTask/componentAddTask', jadeData);
    this._personWrapper = this.element.getElementsByClassName(ComponentAddTask.PERSON_WRAPPER_CLASS)[0];
    this._lengthInput = this.element.getElementsByClassName(jadeData.taskLengthInputClass)[0];
    this._dateInput = this.element.getElementsByClassName(jadeData.dateInputClass)[0];
    var bottomDiv = this.element.getElementsByClassName(ComponentAddTask.BOTTOM_WRAPPER_CLASS)[0];

    var tabbedAreaDiv = document.createElement('div');
    this.element.insertBefore(tabbedAreaDiv, bottomDiv);
    this.addChild('tabbedArea', this._tabbedAreaComponent, {el: tabbedAreaDiv});

    var button = this.element.getElementsByClassName(jadeData.saveButtonClass)[0];
    button.addEventListener('click', this.handleSaveClickEvent.bind(this), false);

    this.element.addEventListener('click', this.handleClickEvent.bind(this), false);
};


ComponentAddTask.prototype.handleSaveClickEvent = function(){
    var userStatus = this._componentFilter.getStatus();
    var selectedTab = this._tabbedAreaComponent.getSelectedTabNumber();
    var taskStatus = selectedTab === 0 ? this._leftComponent.getStatus() : this._rightComponent.getStatus();
    var team = userStatus.team.id;
    var department = userStatus.department.id;
    var length = this._lengthInput.value;
    var dateFrom = new Date(this._dateInput.value);
    var correctlyFilled = this.checkInputs(userStatus, taskStatus, dateFrom, length, selectedTab);
    var title, description, template_team, template_department;

    if(correctlyFilled) {
        var dateTo = new Date(dateFrom.getTime() + (Number(length) * Const.MILIS_PER_DAY)).toDateString();

        switch (selectedTab) {
            case 0 :    //new task is inserted
                title = taskStatus.title;
                description = taskStatus.description;
                template_team = taskStatus.team_id;
                template_department = taskStatus.department_id;
                break;
            case 1 :    //task template is chosen
                var template = this._rightComponent.getSelectedTemplate(taskStatus.task_template.id);
                title = template.title;
                description = template.description;
                template_team = template.id_team;
                template_department = template.id_department;
                break;
        }

        if (selectedTab === 0 && taskStatus.save_as_template) {
            hrtool.actions.insertNewTemplate(this.templateModel, {
                title: title,
                description: description,
                id_team: template_team,
                id_department: template_department
            });
        }

        hrtool.actions.insertNewTask(this.taskModel, {
            title: title,
            description: description,
            id_team: team,
            id_department: department,
            id_user: userStatus.user.id,
            id_buddy: this._buddyDropdown.selected.id,
            date_from: this._dateInput.value,
            date_to: dateTo
        });
    }
};




ComponentAddTask.prototype.checkInputs = function(userStatus, taskStatus, dateFrom, length, selectedTab){
    var ret = true;
    var now = new Date();

    if(userStatus.department.id === -1){
        this.addNotification(document.createTextNode('User department wasn\'t picked!'),
            ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        this._componentFilter._dropdowns[0].setInvalidInputClass();
        ret = false;
    }

    if(userStatus.team.id === -1){
        this.addNotification(document.createTextNode('User team wasn\'t picked!'),
            ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        if(this._componentFilter._dropdowns[1].getIsEnabled()) {
            this._componentFilter._dropdowns[1].setInvalidInputClass();
        }
        ret = false;
    }

    if(userStatus.user.id === -1){
        this.addNotification(document.createTextNode('User wasn\'t picked!'),
            ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        if(this._componentFilter._dropdowns[2].getIsEnabled()) {
            this._componentFilter._dropdowns[2].setInvalidInputClass();
        }
        ret = false;
    }

    if(this._buddyDropdown.selected.id === -1){
        this.addNotification(document.createTextNode('Task buddy wasn\' picked!'),
            ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        this._buddyDropdown.setInvalidInputClass();
        ret = false;
    }

    if(userStatus.user.id !== -1 && (userStatus.user.id === this._buddyDropdown.selected.id)){
        this.addNotification(document.createTextNode('User and task buddy cannot be the same person!'),
            ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        this._componentFilter._dropdowns[2].setInvalidInputClass();
        this._buddyDropdown.setInvalidInputClass();
        ret = false;
    }

    if(dateFrom == 'Invalid Date' || dateFrom.getFullYear() < now.getFullYear() || dateFrom.getMonth() < now.getMonth()
        || dateFrom.getDate() < now.getDate()){
        this.addNotification(document.createTextNode('Date wasn\'t fill correctly!'),
            ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        this.setInvalidInputClass(this._dateInput);
        ret = false;
    }

    if(!Number(length)){
        this.addNotification(document.createTextNode('Length of new task has to be number!'),
            ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        this.setInvalidInputClass(this._lengthInput);
        ret = false;
    }

    if(selectedTab === 0) {
        if (taskStatus.title === '') {
            this.addNotification(document.createTextNode('Title of new task has to be filled in!'),
                ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
            this.setInvalidInputClass(this._leftComponent._title);
            ret = false;
        }

        if (taskStatus.description === '') {
            this.addNotification(document.createTextNode('Description of new task has to be filled in!'),
                ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
            this.setInvalidInputClass(this._leftComponent._text);
            ret = false;
        }

        if(taskStatus.save_as_template && taskStatus.department_id === -1){
            this.addNotification(document.createTextNode('Task department wasn\'t picked!'),
                ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
            this._leftComponent._filter._dropdowns[0].setInvalidInputClass();
            ret = false;
        }

        if(taskStatus.save_as_template && taskStatus.department_id === -1){
            this.addNotification(document.createTextNode('Task team wasn\'t picked!'),
                ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
            this._leftComponent._filter._dropdowns[1].setInvalidInputClass();
            ret = false;
        }
    }

    if(selectedTab === 1) {
        if (taskStatus.task_template.id === -1) {
            this.addNotification(document.createTextNode('Template wasn\'t picked correctly!'),
                ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
            this._rightComponent._componentFilter._dropdowns[2].setInvalidInputClass();
            ret = false;
        }
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
ComponentAddTask.BOTTOM_WRAPPER_CLASS = 'new-task-date-wrapper';

ComponentAddTask.EventType = {
    GET_DATA : 'user/get-all',
    INSERT_NEW_TEMPLATE: 'template/insert',
    INSERT_NEW_TASK: 'tasks/insert'
};

ComponentAddTask.NOTIFICATION_DURATION = 4000;

module.exports = ComponentAddTask;