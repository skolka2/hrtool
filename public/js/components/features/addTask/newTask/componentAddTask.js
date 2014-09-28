(function() {
  var ComponentAddTask, ComponentBase, ComponentDropdown, ComponentFilter, ComponentFilterFormatter, ComponentLeft, ComponentRight, ComponentTabbedArea, Const, Model, NotificationCenter, hrtool,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ComponentBase = require('../../../componentBase');

  ComponentLeft = require('./componentLeft');

  ComponentRight = require('./componentRight');

  ComponentTabbedArea = require('../../componentTabbedArea');

  ComponentFilterFormatter = require('../../componentFilterFormatter');

  ComponentFilter = require('../../componentFilter');

  ComponentDropdown = require('../../componentDropdown');

  Model = require('../../../../models/model');

  hrtool = require('../../../../models/actions');

  Const = require('../../../../helpers/constants');

  NotificationCenter = require('../../../componentNotificationCenter');

  ComponentAddTask = (function(_super) {
    __extends(ComponentAddTask, _super);

    function ComponentAddTask() {
      this.handleDropdownChange = __bind(this.handleDropdownChange, this);
      this.handleClickEvent = __bind(this.handleClickEvent, this);
      this.handleSaveClickEvent = __bind(this.handleSaveClickEvent, this);
      ComponentAddTask.__super__.constructor.call(this);
      this._leftComponent = new ComponentLeft();
      this._rightComponent = new ComponentRight();
      this._tabbedAreaComponent = new ComponentTabbedArea(['New task', 'Choose template'], [[this._leftComponent], [this._rightComponent]]);
      this.setModel(new Model(ComponentAddTask.EventType.GET_USERS), ComponentAddTask.EventType.GET_USERS);
      hrtool.actions.getUsers(this.model);
      this.taskModel = new Model(ComponentAddTask.EventType.INSERT_NEW_TASK);
      this.listen(ComponentAddTask.EventType.INSERT_NEW_TASK, this.taskModel, this.onSave);
      this.templateModel = new Model(ComponentAddTask.EventType.INSERT_NEW_TEMPLATE);
    }

    ComponentAddTask.prototype.onLoad = function(data) {
      var buddies, data2, departments, item, teams, users, _i, _len;
      departments = this.helper.bulk.getDepartmentData();
      teams = this.helper.bulk.getTeamData();
      users = {};
      buddies = {};
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        buddies[item.id_user] = item;
        users[item.unique_id] = item;
      }
      data2 = ComponentFilterFormatter.factory.createUsersDropdownsData(departments, teams, users);
      this._componentFilter = new ComponentFilter(data2, ['department', 'team', 'user'], [false, false, true]);
      this.addChild('componentFilter', this._componentFilter, {
        el: this._personWrapper
      });
      this._componentFilter.render(this._personWrapper);
      this.listen(ComponentDropdown.EventType.CHANGE, this._componentFilter, this.handleDropdownChange);
      buddies = ComponentFilterFormatter.transform(buddies, 'id_user', 'full_name');
      this._buddyDropdown = new ComponentDropdown(buddies[''], true);
      this.addChild('buddyDropdown', this._buddyDropdown, {
        el: this._personWrapper
      });
      this._buddyDropdown.render(this._personWrapper);
    };

    ComponentAddTask.prototype.onSave = function(data) {
      if ((data.name != null) === 'error') {
        this.addNotification("Something messed up during saving!\n error code: " + (data.code != null), ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        this.fire(ComponentAddTask.EventType.SAVE_FAIL, null);
      } else {
        this.addNotification('Saving was successful!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.success);
        this.fire(ComponentAddTask.EventType.SAVE_SUCCESS, null);
      }
    };

    ComponentAddTask.prototype.createDom = function() {
      var bottomDiv, jadeData, tabbedAreaDiv, today;
      today = this.helper.format.getDateInputFormat(new Date());
      jadeData = {
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
      bottomDiv = this.element.getElementsByClassName(ComponentAddTask.BOTTOM_WRAPPER_CLASS)[0];
      tabbedAreaDiv = document.createElement('div');
      this.element.insertBefore(tabbedAreaDiv, bottomDiv);
      this.addChild('tabbedArea', this._tabbedAreaComponent, {
        el: tabbedAreaDiv
      });
      this.saveButton = this.element.getElementsByClassName(jadeData.saveButtonClass)[0];
      this.saveButton.addEventListener(ComponentBase.EventType.CLICK, this.handleSaveClickEvent, false);
      this.element.addEventListener(ComponentBase.EventType.CLICK, this.handleClickEvent, false);
    };

    ComponentAddTask.prototype.handleSaveClickEvent = function() {
      var correctlyFilled, dateFrom, dateTo, department, description, length, selectedTab, taskStatus, team, template, template_department, template_team, title, userStatus;
      userStatus = this._componentFilter.getStatus();
      selectedTab = this._tabbedAreaComponent.getSelectedTabNumber();
      taskStatus = selectedTab === 0 ? this._leftComponent.getStatus() : this._rightComponent.getStatus();
      team = userStatus.team.id;
      department = userStatus.department.id;
      length = this._lengthInput.value;
      dateFrom = new Date(this._dateInput.value);
      correctlyFilled = this.checkInputs(userStatus, taskStatus, dateFrom, length, selectedTab);
      if (correctlyFilled) {
        dateTo = new Date(dateFrom.getTime() + (Number(length) * Const.MILIS_PER_DAY)).toDateString();
        switch (selectedTab) {
          case 0:
            title = taskStatus.title;
            description = taskStatus.description;
            template_team = taskStatus.team_id;
            template_department = taskStatus.department_id;
            break;
          case 1:
            template = this._rightComponent.getSelectedTemplate(taskStatus.task_template.id);
            title = template.title;
            description = template.description;
            template_team = template.id_team;
            template_department = template.id_department;
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
        this.clearInputs();
      }
    };

    ComponentAddTask.prototype.clearInputs = function() {
      this._lengthInput.value = '';
      this._dateInput.value = this.helper.format.getDateInputFormat(new Date());
      this._componentFilter.unselectAll();
      this._buddyDropdown.setSelection(ComponentDropdown.EmptyOption);
      this._leftComponent._title.value = '';
      this._leftComponent._text.value = '';
      this._leftComponent._saveAsNew.setChecked(false);
      this._leftComponent._filter.unselectAll();
      this._leftComponent._filter.setActive(false);
      this._rightComponent._componentFilter.unselectAll();
    };

    ComponentAddTask.prototype.checkInputs = function(userStatus, taskStatus, dateFrom, length, selectedTab) {
      var date, ret, today;
      ret = true;
      date = new Date();
      today = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
      if (userStatus.department.id === -1) {
        this.addNotification('User department wasn\'t picked!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        this._componentFilter._dropdowns[0].setInvalidInputClass();
        ret = false;
      }
      if (userStatus.team.id === -1) {
        this.addNotification('User team wasn\'t picked!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        if (this._componentFilter._dropdowns[1].getIsEnabled()) {
          this._componentFilter._dropdowns[1].setInvalidInputClass();
        }
        ret = false;
      }
      if (userStatus.user.id === -1) {
        this.addNotification('User wasn\'t picked!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        if (this._componentFilter._dropdowns[2].getIsEnabled()) {
          this._componentFilter._dropdowns[2].setInvalidInputClass();
        }
        ret = false;
      }
      if (this._buddyDropdown.selected.id === -1) {
        this.addNotification('Task buddy wasn\' picked!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        this._buddyDropdown.setInvalidInputClass();
        ret = false;
      }
      if (userStatus.user.id !== -1 && (userStatus.user.id === this._buddyDropdown.selected.id)) {
        this.addNotification('User and task buddy cannot be the same person!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        this._componentFilter._dropdowns[2].setInvalidInputClass();
        this._buddyDropdown.setInvalidInputClass();
        ret = false;
      }
      if (dateFrom.toString() === 'Invalid Date' || dateFrom.getTime() < today.getTime()) {
        this.addNotification('Date wasn\'t fill correctly!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        this.setInvalidInputClass(this._dateInput);
        ret = false;
      }
      if (!Number(length)) {
        this.addNotification('Length of new task has to be number!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        this.setInvalidInputClass(this._lengthInput);
        ret = false;
      }
      if (selectedTab === 0) {
        if (taskStatus.title === '') {
          this.addNotification('Title of new task has to be filled in!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
          this.setInvalidInputClass(this._leftComponent._title);
          ret = false;
        }
        if (taskStatus.description === '') {
          this.addNotification('Description of new task has to be filled in!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
          this.setInvalidInputClass(this._leftComponent._text);
          ret = false;
        }
        if (taskStatus.save_as_template && taskStatus.department_id === -1) {
          this.addNotification('Task department wasn\'t picked!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
          this._leftComponent._filter._dropdowns[0].setInvalidInputClass();
          ret = false;
        }
        if (taskStatus.save_as_template && taskStatus.department_id === -1) {
          this.addNotification('Task team wasn\'t picked!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
          this._leftComponent._filter._dropdowns[1].setInvalidInputClass();
          ret = false;
        }
      }
      if (selectedTab === 1) {
        if (taskStatus.task_template.id === -1) {
          this.addNotification('Template wasn\'t picked correctly!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error);
          this._rightComponent._componentFilter._dropdowns[2].setInvalidInputClass();
          ret = false;
        }
      }
      return ret;
    };

    ComponentAddTask.prototype.handleClickEvent = function(event) {
      var type, _ref;
      type = event.target.type;
      if (type === 'text' || type === 'textarea' || type === 'number' || type === 'date') {
        if (_ref = ComponentBase.INVALID_INPUT_CLASS, __indexOf.call(event.target.classList, _ref) >= 0) {
          event.target.classList.remove(ComponentBase.INVALID_INPUT_CLASS);
        }
      }
    };

    ComponentAddTask.prototype.handleDropdownChange = function(selection) {
      var dropdown, item, _i, _len, _ref;
      switch (selection.value) {
        case this._componentFilter._dropdowns[0].selected.value:
          dropdown = this._leftComponent._filter._dropdowns[0];
          break;
        case this._componentFilter._dropdowns[1].selected.value:
          dropdown = this._leftComponent._filter._dropdowns[1];
          break;
        default:
          return;
      }
      _ref = dropdown._map;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.value.value === selection.value) {
          dropdown.setSelection(item.value);
        }
      }
      this._leftComponent._filter.setActive(this._leftComponent._saveAsNew.checked);
    };

    return ComponentAddTask;

  })(ComponentBase);

  ComponentAddTask.WRAPPER_CLASS = 'new-task-wrapper';

  ComponentAddTask.PERSON_WRAPPER_CLASS = 'new-task-person-wrapper';

  ComponentAddTask.BOTTOM_WRAPPER_CLASS = 'new-task-date-wrapper';

  ComponentAddTask.NOTIFICATION_DURATION = 4000;

  ComponentAddTask.EventType = {
    GET_USERS: 'user/get-all',
    INSERT_NEW_TEMPLATE: 'template/insert',
    INSERT_NEW_TASK: 'tasks/insert',
    SAVE_SUCCESS: 'save-success',
    SAVE_FAIL: 'save-fail'
  };

  module.exports = ComponentAddTask;

}).call(this);
