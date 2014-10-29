(function() {
  var RouterConfig, ViewDefault, ViewDepartments, ViewExport, ViewHome, ViewImplicitTasks, ViewPeople, ViewTasks, ViewTemplates, ViewTest;

  ViewHome = require('../views/viewHome');

  ViewDepartments = require('../views/viewDepartments');

  ViewPeople = require('../views/viewPeople');

  ViewTasks = require('../views/viewTasks');

  ViewTest = require('../views/viewTest');

  ViewDefault = require('../views/viewDefault');

  ViewExport = require('../views/viewExport');

  ViewImplicitTasks = require('../views/viewImplicitTasks');

  ViewTemplates = require('../views/viewTemplates');

  RouterConfig = (function() {
    function RouterConfig() {}

    RouterConfig.prototype.setView = function(data) {
      switch (data.view) {
        case 'home':
          return new ViewHome();
        case 'departments':
          return new ViewDepartments();
        case 'people':
          return new ViewPeople();
        case 'tasks':
          return new ViewTasks();
        case 'export':
          return new ViewExport();
        case 'implicit_tasks':
          return new ViewImplicitTasks();
        case 'templates':
          return new ViewTemplates();
        case 'test':
          return new ViewTest();
        default:
          return new ViewHome();
      }
    };

    return RouterConfig;

  })();

  module.exports = RouterConfig;

}).call(this);
