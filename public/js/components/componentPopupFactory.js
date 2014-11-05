(function() {
  var ComponentAddTask, ComponentBase, ComponentCheckBox, ComponentEditUser, ComponentFilter, ComponentFormAddUser, ComponentPopup, ComponentPopupFactory, ComponentSelect, ComponentSelectFactory;

  ComponentPopup = require('./componentPopup');

  ComponentCheckBox = require('./features/componentCheckBox');

  ComponentFilter = require('./features/componentFilter');

  ComponentSelectFactory = require('./features/componentSelectFactory');

  ComponentSelect = require('./features/componentSelect');

  ComponentEditUser = require('./componentEditUser');

  ComponentAddTask = require('./features/addTask/newTask/componentAddTask');

  ComponentFormAddUser = require('./forms/componentFormAddUser');

  ComponentBase = require('./componentBase');

  module.exports = ComponentPopupFactory = {
    getCheckBoxPopup: function(popupTrigger, filter) {
      var popup, popupCheckbox;
      popupCheckbox = new ComponentCheckBox("test", true);
      popup = new ComponentPopup(popupTrigger, popupCheckbox);
      if (filter != null) {
        popup.listen(ComponentFilter.eventType.UPDATED, filter, popup.open);
      }
      return popup;
    },
    getSelectDepTeamPopup: function(popupTrigger) {
      var popup, select;
      select = new ComponentSelectFactory.createDepartmentTeam();
      popup = new ComponentPopup(popupTrigger, select);
      popup.listen(ComponentSelect.eventType.CANCEL, select, popup.close);
      return popup;
    },
    getUserEditPopup: function(idUser) {
      var componentEditUser, popup;
      componentEditUser = new ComponentEditUser(idUser, true);
      popup = new ComponentPopup(componentEditUser);
      popup.listen(ComponentEditUser.eventType.SAVE, componentEditUser, popup.close);
      popup.listen(ComponentEditUser.eventType.CANCEL, componentEditUser, popup.close);
      return popup;
    },
    getNewTaskPopup: function(preselectedUserData, preselectedBuddy) {
      var componentAddTask, popup;
      componentAddTask = new ComponentAddTask(preselectedUserData, preselectedBuddy);
      popup = new ComponentPopup(componentAddTask);
      popup.listen(ComponentAddTask.eventType.SAVE_SUCCESS, componentAddTask, popup.close);
      return popup;
    },
    getNewUserPopup: function() {
      var componentAddUser, popup;
      componentAddUser = new ComponentFormAddUser();
      popup = new ComponentPopup(componentAddUser);
      popup.listen(ComponentFormAddUser.eventType.SAVE, componentAddUser, popup.close);
      return popup;
    }
  };

}).call(this);
