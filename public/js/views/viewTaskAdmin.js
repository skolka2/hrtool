(function() {
  var ComponentAddTask, ComponentHide, ComponentTaskImplicit, ComponentTemplateListFactory, ViewBase, ViewTaskAdmin, helper,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewBase = require('./viewBase');

  ComponentAddTask = require('../components/features/addTask/newTask/componentAddTask');

  ComponentHide = require('../components/features/componentHide');

  helper = require('../helpers/helpers');

  ComponentTemplateListFactory = require('../components/templateList/componentTemplateListFactory');

  ComponentTaskImplicit = require('../components/features/addTask/componentTaskImplicit');

  ViewTaskAdmin = (function(_super) {
    __extends(ViewTaskAdmin, _super);

    function ViewTaskAdmin() {
      ViewTaskAdmin.__super__.constructor.call(this);
    }

    ViewTaskAdmin.prototype.render = function() {
      var component, dataForImplicit, div, hide, hideImplicit, hideTemplate, implicitWrapper, mainWrapper, templateWrapper, viewWrapper;
      ViewTaskAdmin.__super__.render.call(this, arguments);
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      viewWrapper = document.createElement('div');
      viewWrapper.className = "view-wraper";
      viewWrapper.innerHTML = "Task Admin View";
      viewWrapper.appendChild(document.createElement('br'));
      div = document.createElement('div');
      component = new ComponentAddTask();
      component.render(div);
      hide = new ComponentHide(helper.dom.createElement("<span>Insert new task</span>"), div, false);
      hide.render(viewWrapper);
      this.componentTemplateList = new ComponentTemplateListFactory.createAll();
      dataForImplicit = {
        id_task_template: 5,
        id_department: 2,
        id_team: 3,
        title: "title example"
      };
      this.componentTaskImplicit = new ComponentTaskImplicit(dataForImplicit);
      implicitWrapper = document.createElement('div');
      hideImplicit = new ComponentHide(helper.dom.createElement("<span>Insert new implicit task(still example data)</span>"), implicitWrapper, false);
      viewWrapper.appendChild(implicitWrapper);
      templateWrapper = document.createElement('div');
      hideTemplate = new ComponentHide(helper.dom.createElement("<span>Show template tasks</span>"), templateWrapper, false);
      this.componentTaskImplicit.render(implicitWrapper);
      this.componentTemplateList.render(templateWrapper);
      hideImplicit.render(viewWrapper);
      hideTemplate.render(viewWrapper);
      mainWrapper.appendChild(viewWrapper);
    };

    return ViewTaskAdmin;

  })(ViewBase);

  module.exports = ViewTaskAdmin;

}).call(this);
