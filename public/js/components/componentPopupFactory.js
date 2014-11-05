(function() {
  var ComponentAddTask, ComponentBase, ComponentCheckBox, ComponentEditUser, ComponentFilter, ComponentPopup, ComponentPopupFactory, ComponentSelect, ComponentSelectFactory;

  ComponentPopup = require('./componentPopup');

  ComponentCheckBox = require('./features/componentCheckBox');

  ComponentFilter = require('./features/componentFilter');

  ComponentSelectFactory = require('./features/componentSelectFactory');

  ComponentSelect = require('./features/componentSelect');

  ComponentEditUser = require('./componentEditUser');

  ComponentAddTask = require('./features/addTask/newTask/componentAddTask');

  ComponentBase = require('./componentBase');

  module.exports = ComponentPopupFactory = {
    getCheckBoxPopup: function(popupTrigger, filter) {
      var popup, popupCheckbox;
      popupCheckbox = new ComponentCheckBox("test", true);
      popup = new ComponentPopup(popupTrigger, popupCheckbox);
      if (filter != null) {
        popup.listen(ComponentFilter.EventType.UPDATED, filter, popup.open);
      }
      return popup;
    },
    getSelectDepTeamPopup: function(popupTrigger) {
      var popup, select;
      select = new ComponentSelectFactory.createDepartmentTeam();
      popup = new ComponentPopup(popupTrigger, select);
      popup.listen(ComponentSelect.EventType.CANCEL, select, popup.close);
      return popup;
    },
    getUserEditPopup: function(idUser) {
      var componentEditUser, popup;
      componentEditUser = new ComponentEditUser(idUser, true);
      popup = new ComponentPopup(componentEditUser);
      popup.listen(ComponentEditUser.EventType.SAVE, componentEditUser, popup.close);
      popup.listen(ComponentEditUser.EventType.CANCEL, componentEditUser, popup.close);
      return popup;
    },
    getNewTaskPopup: function(preselectedUserData, preselectedBuddy) {
      var componentAddTask, popup;
      componentAddTask = new ComponentAddTask(preselectedUserData, preselectedBuddy);
      popup = new ComponentPopup(componentAddTask);
      popup.listen(ComponentAddTask.EventType.SAVE_SUCCESS, componentAddTask, popup.close);
      return popup;
    }
  };

}).call(this);
