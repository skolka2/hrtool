(function() {
  var ComponentFilter, ComponentFilterFormatter, ComponentTableFactory, ComponentTableWrapper, ComponentTaskImplicit, ComponentTextInput, ViewBase, ViewImplicitTasks,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewBase = require('./viewBase');

  ComponentFilterFormatter = require('../components/features/componentFilterFormatter');

  ComponentFilter = require('../components/features/componentFilter');

  ComponentTableWrapper = require('../components/table/componentTableWrapper');

  ComponentTextInput = require('../components/features/componentTextInput');

  ComponentTableFactory = require('../components/table/componentTableFactory');

  ComponentTaskImplicit = require('../components/features/addTask/componentTaskImplicit');

  ViewImplicitTasks = (function(_super) {
    __extends(ViewImplicitTasks, _super);

    function ViewImplicitTasks() {
      ViewImplicitTasks.__super__.constructor.call(this);
    }

    ViewImplicitTasks.prototype.render = function() {
      var addTaskDiv, componentTaskImplicit, dataForImplicit, filterData, mainWrapper, tableDiv, tasksTable, viewWrapper;
      ViewImplicitTasks.__super__.render.call(this);
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      viewWrapper = document.createElement('div');
      viewWrapper.className = "view-wraper";
      viewWrapper.innerHTML = "Implicit Tasks View";
      viewWrapper.appendChild(document.createElement('br'));
      tableDiv = document.createElement('div');
      tableDiv.innerHTML = "Table of implicit tasks";
      filterData = ComponentFilterFormatter.factory.createTeamDropdownsData(this.helper.bulk.getDepartmentData(), this.helper.bulk.getTeamData());
      tasksTable = new ComponentTableWrapper(ComponentTableFactory.implicitTable(), new ComponentFilter(filterData), new ComponentTextInput('Type name'));
      tasksTable.render(tableDiv);
      viewWrapper.appendChild(tableDiv);
      viewWrapper.appendChild(document.createElement('br'));
      addTaskDiv = document.createElement('div');
      addTaskDiv.innerHTML = "Form for adding new implicit task";
      dataForImplicit = {
        id_task_template: 5,
        id_department: 2,
        id_team: 3,
        title: "title example"
      };
      componentTaskImplicit = new ComponentTaskImplicit(dataForImplicit);
      componentTaskImplicit.render(addTaskDiv);
      viewWrapper.appendChild(addTaskDiv);
      viewWrapper.appendChild(document.createElement('br'));
      mainWrapper.appendChild(viewWrapper);
    };

    return ViewImplicitTasks;

  })(ViewBase);

  module.exports = ViewImplicitTasks;

}).call(this);
