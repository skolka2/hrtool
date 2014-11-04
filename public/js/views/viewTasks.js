(function() {
  var ComponentAddTask, ComponentHide, ViewBase, ViewTasks,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewBase = require('./viewBase');

  ComponentAddTask = require('../components/features/addTask/newTask/componentAddTask');

  ComponentHide = require('../components/features/componentHide');

  ViewTasks = (function(_super) {
    __extends(ViewTasks, _super);

    function ViewTasks() {
      ViewTasks.__super__.constructor.call(this);
    }

    ViewTasks.prototype.render = function() {
      var component, div, hide, mainWrapper, viewWrapper;
      ViewTasks.__super__.render.call(this);
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      viewWrapper = document.createElement('div');
      viewWrapper.className = "view-wraper";
      viewWrapper.innerHTML = "Task Admin View";
      viewWrapper.appendChild(document.createElement('br'));
      div = document.createElement('div');
      component = new ComponentAddTask();
      component.render(div);
      hide = new ComponentHide(this.helper.dom.createElement("<span>Insert new task</span>"), div, false);
      hide.render(viewWrapper);
      mainWrapper.appendChild(viewWrapper);
    };

    return ViewTasks;

  })(ViewBase);

  module.exports = ViewTasks;

}).call(this);
