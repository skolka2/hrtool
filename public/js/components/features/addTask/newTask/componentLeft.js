(function() {
  var ComponentBase, ComponentCheckBox, ComponentDropdown, ComponentFilter, ComponentFilterFormatter, ComponentLeft, helper,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../../../componentBase');

  ComponentCheckBox = require('../../componentCheckBox');

  ComponentFilterFormatter = require('../../componentFilterFormatter');

  ComponentFilter = require('../../componentFilter');

  ComponentDropdown = require('../../componentDropdown');

  helper = require('../../../../helpers/helpers');

  ComponentLeft = (function(_super) {
    __extends(ComponentLeft, _super);

    function ComponentLeft() {
      this.handleSetAsImplicitChanged = __bind(this.handleSetAsImplicitChanged, this);
      ComponentLeft.__super__.constructor.call(this);
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
      this.listen(ComponentBase.EventType.CHANGE, this._saveAsNew, this.handleSetAsImplicitChanged);
    }

    ComponentLeft.prototype.createDom = function() {
      var data, departments, labelDiv, taskText, taskTitle, teams, textDiv, titleDiv;
      this.element = document.createElement('div');
      this.element.className = 'add-task-wrapper';
      labelDiv = document.createElement('div');
      labelDiv.className = "add-task-header";
      labelDiv.innerText = 'Task';
      titleDiv = document.createElement("div");
      taskTitle = document.createElement('span');
      taskTitle.className = "add-task-title-label";
      taskTitle.innerText = "Task title";
      titleDiv.appendChild(taskTitle);
      this._title = document.createElement('input');
      this._title.id = this.componentId + '-title';
      titleDiv.appendChild(this._title);
      textDiv = document.createElement("div");
      taskText = document.createElement('span');
      taskText.className = 'add-task-text-label';
      taskText.innerText = 'Task description';
      textDiv.appendChild(taskText);
      this._text = document.createElement('textarea');
      this._text.id = this.componentId + '-text';
      textDiv.appendChild(this._text);
      this._selectorDiv = document.createElement('div');
      this._selectorDiv.className = "add-task-selector";
      this.element.appendChild(labelDiv);
      this.element.appendChild(titleDiv);
      this.element.appendChild(textDiv);
      this.addChild("checkBox_" + this._saveAsNew.componentId, this._saveAsNew, {
        el: this._selectorDiv
      });
      departments = this.helper.bulk.getData(['departments']);
      teams = this.helper.bulk.getData(['teams']);
      data = ComponentFilterFormatter.factory.createTeamDropdownsData(departments, teams);
      this._filter = new ComponentFilter(data, ['department', 'team']);
      this._filter.setActive(false);
      this.element.appendChild(this._selectorDiv);
      this.addChild("filter_" + this._filter.componentId, this._filter, {
        el: this._selectorDiv
      });
      return this.listen(ComponentDropdown.EventType.CHANGE, this._filter, this.handleSetAsImplicitChanged);
    };

    ComponentLeft.prototype.getStatus = function() {
      var filterStatus;
      if (this._filter) {
        filterStatus = this._filter.getStatus();
        this._status.department_id = helper.obj.getData(filterStatus, ['department', 'id']);
        this._status.team_id = helper.obj.getData(filterStatus, ['team', 'id']);
      }
      this._status.title = helper.obj.getData(this, ['_title', 'value']);
      this._status.description = helper.obj.getData(this, ['_text', 'value']);
      this._status.save_as_template = helper.obj.getData(this, ['_saveAsNew', 'checked']);
      return this._status;
    };

    ComponentLeft.prototype.handleSetAsImplicitChanged = function(data) {
      this._filter.setActive(data);
      return this.fire(ComponentBase.EventType.CHANGE, this.getStatus());
    };

    return ComponentLeft;

  })(ComponentBase);

  module.exports = ComponentLeft;

}).call(this);
