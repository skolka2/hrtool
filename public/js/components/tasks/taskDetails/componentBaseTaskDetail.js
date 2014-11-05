(function() {
  var ComponentBase, ComponentBaseTaskDetail,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../../componentBase');

  ComponentBaseTaskDetail = (function(_super) {
    __extends(ComponentBaseTaskDetail, _super);

    function ComponentBaseTaskDetail(taskParams) {
      ComponentBaseTaskDetail.__super__.constructor.call(this);
      this.taskId = taskParams.taskId;
      this.taskBuddy = taskParams.taskOwner;
      this.taskTitle = taskParams.taskTitle;
      this.dateFrom = new Date(taskParams.dateFrom);
      this.dateTo = new Date(taskParams.dateTo);
      this.taskDescription = taskParams.taskDescription;
      this.taskNotes = taskParams.taskNotes;
      this.isFinished = taskParams.isFinished;
      this.notesElement = null;
      return;
    }

    ComponentBaseTaskDetail.prototype.createDom = function() {
      var jadeData, notesWrapper, taskDateString;
      taskDateString = "Timerange: " + (this.helper.format.getDate(this.dateFrom)) + " - " + (this.helper.format.getDate(this.dateTo));
      jadeData = {
        taskWrapperClass: this.getTaskWrapperClass(),
        headerWrapperClass: ComponentBaseTaskDetail.taskClasses.HEADER_WRAPPER_CLASS,
        buddyLabelClass: ComponentBaseTaskDetail.taskClasses.BUDDY_LABEL_CLASS,
        notesWrapperClass: ComponentBaseTaskDetail.taskClasses.NOTES_WRAPPER_CLASS,
        footerWrapperClass: ComponentBaseTaskDetail.taskClasses.FOOTER_WRAPPER_CLASS,
        buddy: this.taskBuddy,
        title: this.taskTitle,
        taskDate: taskDateString,
        description: this.taskDescription
      };
      this.element = this.helper.tpl.create('components/tasks/taskDetails/componentBaseTaskDetail', jadeData);
      notesWrapper = (this.element.getElementsByClassName(ComponentBaseTaskDetail.taskClasses.NOTES_WRAPPER_CLASS))[0];
      this.setNotes();
      notesWrapper.appendChild(this.notesElement);
    };

    ComponentBaseTaskDetail.prototype.setNotes = function() {
      this.notesElement = document.createElement('p');
      this.notesElement.className = "notes-text";
      return this.notesElement.innerHTML = this.taskNotes;
    };

    ComponentBaseTaskDetail.prototype.getTaskWrapperClass = function() {
      var wrapperClass;
      wrapperClass = ["task-wrapper"];
      if (!(this.isFinished || this.dateTo >= new Date())) {
        wrapperClass.push("overflow");
      }
      return wrapperClass;
    };

    return ComponentBaseTaskDetail;

  })(ComponentBase);

  ComponentBaseTaskDetail.taskClasses = {
    HEADER_WRAPPER_CLASS: "header-wrapper",
    BUDDY_LABEL_CLASS: "buddy-label",
    NOTES_WRAPPER_CLASS: "notes-wrapper",
    FOOTER_WRAPPER_CLASS: "footer-wrapper"
  };

  module.exports = ComponentBaseTaskDetail;

}).call(this);
