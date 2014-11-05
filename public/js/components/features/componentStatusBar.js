(function() {
  var ComponentBase, ComponentStatusBar,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../componentBase');

  ComponentStatusBar = (function(_super) {
    __extends(ComponentStatusBar, _super);

    function ComponentStatusBar() {
      ComponentStatusBar.__super__.constructor.call(this);
      this.data = null;
      return;
    }

    ComponentStatusBar.prototype.onLoad = function(data) {
      var deadlineDiv, finishedDiv, infoSpan;
      this.data = {
        userFirstName: this.helper.bulk.getData(['user', 'first_name']),
        userLastName: this.helper.bulk.getData(['user', 'last_name']),
        allTasks: data[0].all_tasks,
        finishedTasks: data[0].finished_tasks,
        deadlineTasks: data[0].deadline_tasks
      };
      infoSpan = (this.element.getElementsByClassName(ComponentStatusBar.classes.INFO_SPAN_CLASS))[0];
      infoSpan.innerText = "Welcome, " + this.data.userFirstName + " " + this.data.userLastName + ", here are your awesome tasks. You have " + this.data.finishedTasks + "/" + this.data.allTasks + " finished, " + this.data.deadlineTasks + " after deadline...";
      finishedDiv = (this.element.getElementsByClassName(ComponentStatusBar.classes.PROGRESS_DIV_FINISHED))[0];
      finishedDiv.style.width = this.getFinishedPartWidth();
      deadlineDiv = (this.element.getElementsByClassName(ComponentStatusBar.classes.PROGRESS_DIV_DEADLINE))[0];
      deadlineDiv.style.width = this.getDeadlinePartWidth();
    };

    ComponentStatusBar.prototype.createDom = function() {
      var jadeData;
      jadeData = {
        infoSpanClass: ComponentStatusBar.classes.INFO_SPAN_CLASS,
        progressDivFinished: ComponentStatusBar.classes.PROGRESS_DIV_FINISHED,
        progressDivDeadline: ComponentStatusBar.classes.PROGRESS_DIV_DEADLINE
      };
      this.element = this.helper.tpl.create('components/features/componentStatusBar', jadeData);
    };

    ComponentStatusBar.prototype.getFinishedPartWidth = function() {
      var percent;
      return percent = (100 * (this.data.finishedTasks / this.data.allTasks)) + '%';
    };

    ComponentStatusBar.prototype.getDeadlinePartWidth = function() {
      var percent;
      return percent = (100 * (this.data.deadlineTasks / this.data.allTasks)) + '%';
    };

    return ComponentStatusBar;

  })(ComponentBase);

  ComponentStatusBar.eventType.DATA_LOAD = 'tasks/count';

  ComponentStatusBar.classes = {
    INFO_SPAN_CLASS: "status-bar-info-text",
    PROGRESS_DIV_FINISHED: "status-bar-progress-finished",
    PROGRESS_DIV_DEADLINE: "status-bar-progress-deadline"
  };

  module.exports = ComponentStatusBar;

}).call(this);
