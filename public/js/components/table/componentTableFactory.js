(function() {
  var ComponentCheckBox, ComponentEditUser, ComponentPopupFactory, ComponentTable, ComponentTableFactory, Model, helper, hrtool;

  Model = require('../../models/model');

  hrtool = require('../../models/actions');

  ComponentTable = require('./componentTable');

  helper = require('../../helpers/helpers');

  ComponentCheckBox = require('../features/componentCheckBox');

  helper = require('../../helpers/helpers');

  ComponentEditUser = require('../componentEditUser');

  ComponentPopupFactory = require('../componentPopupFactory');

  module.exports = ComponentTableFactory = {
    implicitTable: function() {
      var implicitTab;
      implicitTab = new ComponentTable(ComponentTableFactory.getImplicitTableFormat, ComponentTableFactory.implicitTableSettings);
      implicitTab.setModel(new Model(ComponentTableFactory.implicitTableSettings.endpoint), ComponentTableFactory.implicitTableSettings.endpoint);
      implicitTab._action(implicitTab.model, implicitTab.reqData);
      return implicitTab;
    },
    createUsersTable: function() {
      var usersTable;
      usersTable = new ComponentTable(ComponentTableFactory.getUsersTableFormat, ComponentTableFactory.usersTableSettings);
      usersTable.setModel(new Model(ComponentTableFactory.usersTableSettings.endpoint), ComponentTableFactory.usersTableSettings.endpoint);
      hrtool.actions.getUsersForTable(usersTable.model, usersTable.reqData);
      return usersTable;
    },
    implicitTableSettings: {
      limit: 3,
      offset: 0,
      sortBy: 'id_task_implicit',
      sort_way: "DESC",
      endpoint: 'tasks/implicit/list',
      actionFunc: hrtool.actions.getImplicitTasks
    },
    usersTableSettings: {
      limit: 4,
      offset: 0,
      sortBy: 'full_name',
      sortDesc: false,
      sort_way: "ASC",
      endpoint: 'user/get-table-data',
      actionFunc: hrtool.actions.getUsersForTable
    },
    getImplicitTableFormat: function() {
      return [
        {
          title: 'Title',
          keys: ['title'],
          sortKey: 'title',
          formatter: function(params) {
            return '<span>' + params[0] + '</span>';
          }
        }, {
          title: 'Department',
          keys: ['id_department'],
          formatter: function(params) {
            if (params[0] === null) {
              return '<span > -</span>';
            } else {
              return '<span >' + helper.bulk.getDepartmentData()[params[0]].title + '</span>';
            }
          }
        }, {
          title: 'Team',
          keys: ['id_team'],
          formatter: function(params) {
            if (params[0] === null) {
              return '<span > -</span>';
            } else {
              return '<span >' + helper.bulk.getTeamData()[params[0]].title + '</span>';
            }
          }
        }, {
          title: 'Tasks starts at',
          keys: ['start_day'],
          sortKey: 'start_day',
          formatter: function(params) {
            return '<span >' + params[0] + '</span>';
          }
        }, {
          title: 'Task lenght',
          keys: ['duration'],
          sortKey: 'duration',
          formatter: function(params) {
            return '<span >' + params[0] + '</span>';
          }
        }, {
          title: 'desc',
          keys: ['description'],
          sortKey: 'description',
          formatter: function(params) {
            return '<span >' + params[0] + '</span>';
          }
        }, {
          title: 'Functions',
          keys: ['id_user'],
          formatter: function(params) {
            var button, div;
            div = document.createElement('div');
            div.className = 'functions-div';
            button = document.createElement('button');
            button.innerHTML = 'Save';
            div.appendChild(button);
            button = document.createElement('button');
            button.innerHTML = 'Edit';
            div.appendChild(button);
            button = document.createElement('button');
            button.innerHTML = 'Remove';
            div.appendChild(button);
            return div;
          }
        }
      ];
    },
    getUsersTableFormat: function() {
      return [
        {
          title: 'Name',
          keys: ['full_name'],
          sortKey: 'full_name',
          formatter: function(params) {
            var div;
            div = document.createElement('div');
            div.className = 'name-div';
            div.innerHTML = '<span>' + params[0] + '</span>';
            return div;
          }
        }, {
          title: 'Done',
          keys: ['done', 'undone'],
          formatter: function(params) {
            var div, span;
            div = document.createElement('div');
            div.className = 'tasks';
            span = document.createElement('span');
            span.className = 'done-tasks-count';
            span.innerHTML = params[0];
            div.appendChild(span);
            div.appendChild(document.createTextNode('/'));
            span = document.createElement('span');
            span.className = 'undone-tasks-count';
            span.innerHTML = params[1];
            div.appendChild(span);
            return div;
          }
        }, {
          title: 'Department/Team',
          keys: ['id_user'],
          formatter: function(params) {
            return new ComponentEditUser(params[0]).getElement();
          }
        }, {
          title: 'Functions',
          keys: ['id_user'],
          formatter: function(params) {
            var buttonA, buttonE, buttonR, buttonV, div;
            div = document.createElement('div');
            div.className = 'functions-div';
            buttonV = document.createElement('button');
            buttonV.innerHTML = 'View Tasks';
            buttonA = document.createElement('button');
            buttonA.innerHTML = 'Add New Task';
            buttonA.addEventListener('click', function(ev) {
              var popup;
              popup = ComponentPopupFactory.getNewTaskPopup();
              return popup.open();
            }, false);
            buttonE = document.createElement('button');
            buttonE.innerHTML = 'Edit';
            buttonE.addEventListener('click', function(ev) {
              var popup;
              popup = ComponentPopupFactory.getUserEditPopup(params[0]);
              return popup.open();
            }, false);
            buttonR = document.createElement('button');
            buttonR.innerHTML = 'Remove';
            div.appendChild(buttonV);
            div.appendChild(buttonA);
            div.appendChild(buttonE);
            div.appendChild(buttonR);
            return div;
          }
        }
      ];
    }
  };

}).call(this);