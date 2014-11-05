(function() {
  var ComponentStatusBar, ComponentStatusBarFactory, Model, hrtool;

  Model = require('../../models/model');

  hrtool = require('../../models/actions');

  ComponentStatusBar = require('./componentStatusBar');

  ComponentStatusBarFactory = {
    createStatusBar: function(userId) {
      var statusBar, statusBarModel;
      statusBar = new ComponentStatusBar;
      statusBarModel = new Model(ComponentStatusBar.eventType.DATA_LOAD);
      statusBar.setModel(statusBarModel, ComponentStatusBar.eventType.DATA_LOAD);
      hrtool.actions.getTasksCount(statusBar.model, userId);
      return statusBar;
    }
  };

  module.exports = ComponentStatusBarFactory;

}).call(this);
