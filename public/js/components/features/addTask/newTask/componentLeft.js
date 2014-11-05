(function() {
  var ComponentBase, ComponentCheckBox, ComponentDropdown, ComponentFilter, ComponentFilterFormatter, ComponentLeft, ComponentLeftBase, helper,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../../../componentBase');

  ComponentLeftBase = require('./componentLeftBase');

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
        department_id: -1,
        team_id: -1,
        save_as_template: false
      };
      this._saveAsNew = new ComponentCheckBox('Save as template', false);
      this.listen(ComponentBase.eventType.CHANGE, this._saveAsNew, this.handleSetAsImplicitChanged);
    }

    ComponentLeft.prototype.createDom = function() {
      var data, departments, teams;
      ComponentLeft.__super__.createDom.call(this);
      this._selectorDiv = document.createElement('div');
      this._selectorDiv = document.createElement('div');
      this._selectorDiv.className = "add-task-selector";
      this.addChild("checkBox_" + this._saveAsNew.componentId, this._saveAsNew, {
        el: this._selectorDiv
      });
      departments = helper.bulk.getData(['departments']);
      teams = helper.bulk.getData(['teams']);
      data = ComponentFilterFormatter.factory.createTeamDropdownsData(departments, teams);
      this._filter = new ComponentFilter(data, ['department', 'team']);
      this._filter.setActive(false);
      this.element.appendChild(this._selectorDiv);
      this.addChild("filter_" + this._filter.componentId, this._filter, {
        el: this._selectorDiv
      });
      return this.listen(ComponentDropdown.eventType.CHANGE, this._filter, this.handleSetAsImplicitChanged);
    };

    ComponentLeft.prototype.getStatus = function() {
      var filterStatus;
      ComponentLeft.__super__.getStatus.call(this);
      if (this._filter) {
        filterStatus = this._filter.getStatus();
        this._status.department_id = helper.obj.getData(filterStatus, ['department', 'id']);
        this._status.team_id = helper.obj.getData(filterStatus, ['team', 'id']);
      }
      this._status.save_as_template = helper.obj.getData(this, ['_saveAsNew', 'checked']);
      return this._status;
    };

    ComponentLeft.prototype.handleSetAsImplicitChanged = function(data) {
      this._filter.setActive(data);
      return this.fire(ComponentBase.eventType.CHANGE, this.getStatus());
    };

    return ComponentLeft;

  })(ComponentLeftBase);

  module.exports = ComponentLeft;

}).call(this);
