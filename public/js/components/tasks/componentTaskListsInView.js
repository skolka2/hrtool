(function() {
  var ComponentBase, ComponentFilter, ComponentFilterFormatter, ComponentHide, ComponentTaskList, ComponentTaskListFactory, ComponentTaskListsInView, ComponentUserTaskDetail, Model, helper, hrtool,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../componentBase');

  ComponentFilterFormatter = require('../features/componentFilterFormatter');

  ComponentFilter = require('../features/componentFilter');

  ComponentTaskListFactory = require('./componentTaskListFactory');

  ComponentHide = require('../features/componentHide');

  ComponentTaskList = require('./componentTaskList');

  ComponentUserTaskDetail = require('./taskDetails/componentUserTaskDetail');

  Model = require('../../models/model');

  hrtool = require('../../models/actions');

  helper = require('../../helpers/helpers');

  ComponentTaskListsInView = (function(_super) {
    __extends(ComponentTaskListsInView, _super);

    function ComponentTaskListsInView(title, listCompleted, listNotCompleted, useFilter) {
      this.title = title;
      this.useFilter = useFilter;
      ComponentTaskListsInView.__super__.constructor.call(this);
      this.listCompleted = listCompleted();
      this.listNotCompleted = listNotCompleted();
      this.taskFilter = null;
      this.taskFilterData = null;
      this.isHr = helper.bulk.getData(["user", "is_hr"]);
      if (this.isHr) {
        this.departments = this.helper.bulk.getData(['departments']);
        this.teams = this.helper.bulk.getData(['teams']);
      } else {
        this.departments = this.helper.bulk.getData(['userDepartments']);
        this.teams = this.helper.bulk.getData(['userTeams']);
      }
    }

    ComponentTaskListsInView.prototype.createDom = function() {
      var completedHeader, hideAll, hideCompleted, hideNotCompleted, listCompletedWrapper, listNotCompletedWrapper, listsWrapper, notCompletedHeader, outerHideHeader, outerHideWrapper;
      outerHideWrapper = document.createElement('div');
      outerHideWrapper.className = "outer-hide-wrapper";
      outerHideHeader = document.createElement('h1');
      outerHideHeader.className = "lists-title";
      outerHideHeader.innerText = this.title;
      listsWrapper = document.createElement('div');
      listsWrapper.className = "lists-wrapper";
      hideAll = new ComponentHide(outerHideHeader, listsWrapper, false);
      hideAll.render(outerHideWrapper);
      if (this.useFilter) {
        this.taskFilterData = ComponentFilterFormatter.factory.createTeamDropdownsData(this.departments, this.teams);
        this.taskFilter = new ComponentFilter(this.taskFilterData, ['department', 'team']);
        this.taskFilter.render(listsWrapper);
        this.listen(ComponentFilter.EventType.UPDATED, this.taskFilter, this.handleFilterUpdate);
      }
      notCompletedHeader = document.createElement('h2');
      notCompletedHeader.className = "task-list-header";
      notCompletedHeader.innerText = "Tasks, which are still being worked on:";
      listNotCompletedWrapper = document.createElement('div');
      listNotCompletedWrapper.className = "task-list-wrapper";
      hideNotCompleted = new ComponentHide(notCompletedHeader, listNotCompletedWrapper, false);
      hideNotCompleted.render(listsWrapper);
      completedHeader = document.createElement('h2');
      completedHeader.className = "task-list-header";
      completedHeader.innerText = "Completed tasks:";
      listCompletedWrapper = document.createElement('div');
      listCompletedWrapper.className = "task-list-wrapper";
      hideCompleted = new ComponentHide(completedHeader, listCompletedWrapper, true);
      hideCompleted.render(listsWrapper);
      this.listNotCompleted.render(listNotCompletedWrapper);
      this.listCompleted.render(listCompletedWrapper);
      this.listen(ComponentBase.EventType.CHANGE, this.listNotCompleted, this.handleFinishTask);
      this.element = outerHideWrapper;
    };

    ComponentTaskListsInView.prototype.handleFinishTask = function(src) {
      var finishedTask;
      if (Object.keys(this.listCompleted.childs).length === 0) {
        this.listCompleted.content.innerHTML = '';
      }
      finishedTask = new ComponentUserTaskDetail(src);
      this.listCompleted.addChild('task' + src.taskId, finishedTask, this.listCompleted.content);
      if (this.listCompleted.rendered) {
        finishedTask.render(this.listCompleted.content);
      }
      this.listNotCompleted.childs["task" + src.taskId].component.destroy();
      this.listNotCompleted.removeChild("task" + src.taskId);
      if (Object.keys(this.listNotCompleted.childs).length === 0) {
        this.listNotCompleted.setNoTasks();
      }
    };

    ComponentTaskListsInView.prototype.handleFilterUpdate = function(dataFromFilter) {
      var dataToSend, newModelCompleted, newModelNotCompleted, selectedDepartment, selectedTeam;
      selectedDepartment = dataFromFilter.department.id;
      selectedTeam = dataFromFilter.team.id;
      dataToSend = {
        id_department: selectedDepartment,
        id_team: selectedTeam,
        is_hr: this.isHr
      };
      newModelNotCompleted = new Model(ComponentTaskList.EventType.manager.DATA_LOAD_NOT_COMPLETED);
      newModelCompleted = new Model(ComponentTaskList.EventType.manager.DATA_LOAD_COMPLETED);
      this.listNotCompleted.setModel(newModelNotCompleted, ComponentTaskList.EventType.manager.DATA_LOAD_NOT_COMPLETED);
      this.listCompleted.setModel(newModelCompleted, ComponentTaskList.EventType.manager.DATA_LOAD_COMPLETED);
      hrtool.actions.getManagerTaskDataNotCompleted(this.listNotCompleted.model, dataToSend);
      hrtool.actions.getManagerTaskDataCompleted(this.listCompleted.model, dataToSend);
    };

    return ComponentTaskListsInView;

  })(ComponentBase);

  module.exports = ComponentTaskListsInView;

}).call(this);
