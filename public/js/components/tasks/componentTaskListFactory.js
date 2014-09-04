(function() {
  var ComponentBaseTaskDetail, ComponentTaskList, ComponentTaskListFactory, ComponentUserTaskDetail, Model, helper, hrtool;

  ComponentTaskList = require('./componentTaskList');

  Model = require('../../models/model');

  hrtool = require('../../models/actions');

  helper = require('../../helpers/helpers');

  ComponentUserTaskDetail = require('./taskDetails/componentUserTaskDetail');

  ComponentBaseTaskDetail = require('./taskDetails/componentBaseTaskDetail');

  ComponentTaskListFactory = {
    userTaskDetailSelection: function(data) {
      return new ComponentUserTaskDetail(data);
    },
    baseTaskDetailSelection: function(data) {
      return new ComponentBaseTaskDetail(data);
    },
    UserTaskList: {
      createCompleted: function() {
        var userTaskList, userTaskListModel;
        userTaskList = new ComponentTaskList(ComponentTaskListFactory.userTaskDetailSelection);
        userTaskListModel = new Model(ComponentTaskList.EventType.user.DATA_LOAD_COMPLETED);
        userTaskList.setModel(userTaskListModel, ComponentTaskList.EventType.user.DATA_LOAD_COMPLETED);
        hrtool.actions.getUserTaskDataCompleted(userTaskList.model);
        return userTaskList;
      },
      createNotCompleted: function() {
        var userTaskList, userTaskListModel;
        userTaskList = new ComponentTaskList(ComponentTaskListFactory.userTaskDetailSelection);
        userTaskListModel = new Model(ComponentTaskList.EventType.user.DATA_LOAD_NOT_COMPLETED);
        userTaskList.setModel(userTaskListModel, ComponentTaskList.EventType.user.DATA_LOAD_NOT_COMPLETED);
        hrtool.actions.getUserTaskDataNotCompleted(userTaskList.model);
        return userTaskList;
      }
    },
    BuddyTaskList: {
      createCompleted: function() {
        var buddyTaskList, buddyTaskListModel;
        buddyTaskList = new ComponentTaskList(ComponentTaskListFactory.baseTaskDetailSelection);
        buddyTaskListModel = new Model(ComponentTaskList.EventType.buddy.DATA_LOAD_COMPLETED);
        buddyTaskList.setModel(buddyTaskListModel, ComponentTaskList.EventType.buddy.DATA_LOAD_COMPLETED);
        hrtool.actions.getBuddyTaskDataCompleted(buddyTaskList.model);
        return buddyTaskList;
      },
      createNotCompleted: function() {
        var buddyTaskList, buddyTaskListModel;
        buddyTaskList = new ComponentTaskList(ComponentTaskListFactory.baseTaskDetailSelection);
        buddyTaskListModel = new Model(ComponentTaskList.EventType.buddy.DATA_LOAD_NOT_COMPLETED);
        buddyTaskList.setModel(buddyTaskListModel, ComponentTaskList.EventType.buddy.DATA_LOAD_NOT_COMPLETED);
        hrtool.actions.getBuddyTaskDataNotCompleted(buddyTaskList.model);
        return buddyTaskList;
      }
    },
    ManagerTaskList: {
      createCompleted: function() {
        var managerList, managerListModel;
        managerList = new ComponentTaskList(ComponentTaskListFactory.baseTaskDetailSelection);
        managerListModel = new Model(ComponentTaskList.EventType.manager.DATA_LOAD_COMPLETED);
        managerList.setModel(managerListModel, ComponentTaskList.EventType.manager.DATA_LOAD_COMPLETED);
        hrtool.actions.getManagerTaskDataCompleted(managerList.model, {
          id_department: -1,
          id_team: -1,
          is_hr: helper.bulk.getData(["user", "is_hr"])
        });
        return managerList;
      },
      createNotCompleted: function() {
        var managerList, managerListModel;
        managerList = new ComponentTaskList(ComponentTaskListFactory.baseTaskDetailSelection);
        managerListModel = new Model(ComponentTaskList.EventType.manager.DATA_LOAD_NOT_COMPLETED);
        managerList.setModel(managerListModel, ComponentTaskList.EventType.manager.DATA_LOAD_NOT_COMPLETED);
        hrtool.actions.getManagerTaskDataNotCompleted(managerList.model, {
          id_department: -1,
          id_team: -1,
          is_hr: helper.bulk.getData(["user", "is_hr"])
        });
        return managerList;
      }
    }
  };

  module.exports = ComponentTaskListFactory;

}).call(this);