(function() {
  var ComponentBase, ComponentFilter, ComponentFilterFormatter, ComponentRight, Model, hrtool,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../../../componentBase');

  ComponentFilterFormatter = require('../../componentFilterFormatter');

  ComponentFilter = require('../../componentFilter');

  hrtool = require('../../../../models/actions');

  Model = require('../../../../models/model');

  ComponentRight = (function(_super) {
    __extends(ComponentRight, _super);

    function ComponentRight() {
      ComponentRight.__super__.constructor.call(this);
      this.setModel(new Model(ComponentRight.eventType.GET_USERS), ComponentRight.eventType.GET_USERS);
      hrtool.actions.getTemplatesData(this.model);
    }

    ComponentRight.prototype.onLoad = function(templates) {
      var data, departments, teams;
      this._templates = templates;
      departments = this.helper.bulk.getData(['departments']);
      teams = this.helper.bulk.getData(['teams']);
      data = ComponentFilterFormatter.factory.createTemplateDropdownsData(departments, teams, templates);
      this._componentFilter = new ComponentFilter(data, ['department', 'team', 'task_template']);
      this.addChild('componentFilter', this._componentFilter, {
        el: this.element
      });
      return this._componentFilter.render(this.element);
    };

    ComponentRight.prototype.createDom = function() {
      var headline;
      this.element = document.createElement('div');
      this.element.className = ComponentRight.WRAPPER_CLASS;
      headline = document.createElement('span');
      headline.className = ComponentRight.HEADLINE_CLASS;
      headline.innerHTML = 'Choose saved task';
      return this.element.appendChild(headline);
    };

    ComponentRight.prototype.getSelectedTemplate = function(id) {
      var template, _i, _len, _ref;
      _ref = this._templates;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        template = _ref[_i];
        if (template.id_task_template === id) {
          return template;
        }
      }
    };

    ComponentRight.prototype.getStatus = function() {
      return this._componentFilter.getStatus();
    };

    return ComponentRight;

  })(ComponentBase);

  ComponentRight.WRAPPER_CLASS = 'task-template-div';

  ComponentRight.HEADLINE_CLASS = 'task-template-headline';

  ComponentRight.eventType = {
    GET_DATA: 'template/get-all'
  };

  module.exports = ComponentRight;

}).call(this);
