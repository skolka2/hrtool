(function() {
  var ComponentBase, ComponentBaseTaskDetail, ComponentNotificationCenter, ComponentUserTaskDetail, Model, hrtool,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../../componentBase');

  ComponentBaseTaskDetail = require('./componentBaseTaskDetail');

  ComponentNotificationCenter = require('../../componentNotificationCenter');

  Model = require('../../../models/model');

  hrtool = require('../../../models/actions');

  ComponentUserTaskDetail = (function(_super) {
    __extends(ComponentUserTaskDetail, _super);

    function ComponentUserTaskDetail(taskParams) {
      this.handleTextAreaEnable = __bind(this.handleTextAreaEnable, this);
      this.handleFinishTaskCanceled = __bind(this.handleFinishTaskCanceled, this);
      this.handleFinishTaskConfirmed = __bind(this.handleFinishTaskConfirmed, this);
      this.handleFinishTask = __bind(this.handleFinishTask, this);
      this.handleSaveNotes = __bind(this.handleSaveNotes, this);
      ComponentUserTaskDetail.__super__.constructor.call(this, taskParams);
      this.taskBuddy = taskParams.taskBuddy;
      return;
    }

    ComponentUserTaskDetail.prototype.createDom = function() {
      var buddyLabel, footerWrapper, headerWrapper;
      ComponentUserTaskDetail.__super__.createDom.apply(this, arguments);
      buddyLabel = (this.element.getElementsByClassName(ComponentBaseTaskDetail.taskClasses.BUDDY_LABEL_CLASS))[0];
      headerWrapper = (this.element.getElementsByClassName(ComponentBaseTaskDetail.taskClasses.HEADER_WRAPPER_CLASS))[0];
      footerWrapper = (this.element.getElementsByClassName(ComponentBaseTaskDetail.taskClasses.FOOTER_WRAPPER_CLASS))[0];
      headerWrapper.removeChild(buddyLabel);
      footerWrapper.appendChild(buddyLabel);
      this.finishTaskBttnNo = this.createButton("finish-task-bttn", "No", this.handleFinishTaskCanceled, "none");
      footerWrapper.appendChild(this.finishTaskBttnNo);
      this.finishTaskBttnYes = this.createButton("finish-task-bttn", "Yes", this.handleFinishTaskConfirmed, "none");
      footerWrapper.appendChild(this.finishTaskBttnYes);
      this.finishTaskBttn = this.createButton("finish-task-bttn", "Finish task", this.handleFinishTask);
      footerWrapper.appendChild(this.finishTaskBttn);
      if (this.isFinished) {
        this.finishTaskBttn.disabled = true;
      }
      this.saveNotesBttn = this.createButton("save-notes-bttn", "Save notes", this.handleSaveNotes);
      footerWrapper.appendChild(this.saveNotesBttn);
    };

    ComponentUserTaskDetail.prototype.setNotes = function() {
      this.notesElement = document.createElement('textarea');
      this.notesElement.className = "notes-text-area";
      this.notesElement.innerHTML = this.taskNotes;
      this.notesElement.addEventListener(ComponentBase.eventType.CLICK, this.handleTextAreaEnable);
      this.notesElement.readonly = true;
    };

    ComponentUserTaskDetail.prototype.createButton = function(buttonClass, buttonText, handleFunction, styleDisplay) {
      var buttonElement;
      buttonElement = document.createElement('button');
      buttonElement.className = buttonClass;
      buttonElement.innerHTML = buttonText;
      buttonElement.addEventListener(ComponentBase.eventType.CLICK, handleFunction);
      if (styleDisplay) {
        buttonElement.style.display = styleDisplay;
      }
      return buttonElement;
    };

    ComponentUserTaskDetail.prototype.handleSaveNotes = function(ev) {
      var dataToSend, model, notification;
      if (this.notesElement.value === this.taskNotes) {
        notification = document.createElement('div');
        notification.innerHTML = "Nothing has been changed.";
        this.addNotification(notification, ComponentNotificationCenter.DEFAULT_TIME, ComponentNotificationCenter.eventType.NEUTRAL);
      } else {
        this.saveNotesBttn.disabled = true;
        this.notesElement.readonly = true;
        this.taskNotes = this.notesElement.value;
        dataToSend = {
          id_task: this.taskId,
          notes: this.taskNotes
        };
        model = new Model(ComponentUserTaskDetail.eventType.DATA_UPDATE);
        this.listen(ComponentUserTaskDetail.eventType.DATA_UPDATE, model, this.saveNotesConfirmed);
        hrtool.actions.updateUserTaskData(model, dataToSend);
      }
    };

    ComponentUserTaskDetail.prototype.saveNotesConfirmed = function() {
      var notification;
      this.saveNotesBttn.disabled = false;
      notification = document.createElement('div');
      notification.innerHTML = 'Save succesfull.';
      this.addNotification(notification, ComponentNotificationCenter.DEFAULT_TIME, ComponentNotificationCenter.eventType.SUCCESS);
    };

    ComponentUserTaskDetail.prototype.handleFinishTask = function(ev) {
      if (!this.isFinished) {
        this.setButtonsDisplay(true);
      }
    };

    ComponentUserTaskDetail.prototype.handleFinishTaskConfirmed = function(ev) {
      var dataToSend, model;
      this.finishTaskBttnYes.disabled = true;
      this.finishTaskBttnNo.disabled = true;
      dataToSend = {
        id_task: this.taskId
      };
      model = new Model(ComponentUserTaskDetail.eventType.TASK_FINISH);
      this.listen(ComponentUserTaskDetail.eventType.TASK_FINISH, model, this.finishTaskOk);
      hrtool.actions.finishUserTask(model, dataToSend);
    };

    ComponentUserTaskDetail.prototype.finishTaskOk = function() {
      var notification, taskParamsToSend;
      this.finishTaskBttnYes.disabled = false;
      this.finishTaskBttnNo.disabled = false;
      this.setButtonsDisplay(false);
      notification = document.createElement('div');
      notification.innerHTML = 'Task has been completed.';
      this.addNotification(notification, ComponentNotificationCenter.DEFAULT_TIME, ComponentNotificationCenter.eventType.SUCCESS);
      this.isFinished = true;
      taskParamsToSend = {
        taskId: this.taskId,
        taskBuddy: this.taskBuddy,
        taskTitle: this.taskTitle,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        taskDescription: this.taskDescription,
        taskNotes: this.taskNotes,
        isFinished: this.isFinished
      };
      this.element.className = this.getTaskWrapperClass();
      this.fire(ComponentBase.eventType.CHANGE, taskParamsToSend);
    };

    ComponentUserTaskDetail.prototype.handleFinishTaskCanceled = function(ev) {
      this.setButtonsDisplay(false);
    };

    ComponentUserTaskDetail.prototype.setButtonsDisplay = function(display) {
      var initial, none;
      none = 'none';
      initial = 'initial';
      if ((this.finishTaskBttn != null) && (this.finishTaskBttnYes != null) && (this.finishTaskBttnNo != null)) {
        if (display) {
          this.finishTaskBttn.style.display = none;
          this.finishTaskBttnYes.style.display = initial;
          this.finishTaskBttnNo.style.display = initial;
        } else {
          this.finishTaskBttn.style.display = initial;
          this.finishTaskBttnYes.style.display = none;
          this.finishTaskBttnNo.style.display = none;
        }
      }
    };

    ComponentUserTaskDetail.prototype.handleTextAreaEnable = function(ev) {
      this.notesElement.readonly = false;
    };

    return ComponentUserTaskDetail;

  })(ComponentBaseTaskDetail);

  ComponentUserTaskDetail.eventType = {
    DATA_UPDATE: 'tasks/update',
    TASK_FINISH: 'tasks/finish'
  };

  module.exports = ComponentUserTaskDetail;

}).call(this);
