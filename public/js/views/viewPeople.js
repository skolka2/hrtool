(function() {
  var ComponentFilter, ComponentFilterFormatter, ComponentFormAddUser, ComponentTableFactory, ComponentTableWrapper, ComponentTextInput, ViewBase, ViewPeople,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewBase = require('./viewBase');

  ComponentFormAddUser = require('../components/forms/componentFormAddUser');

  ComponentFilterFormatter = require('../components/features/componentFilterFormatter');

  ComponentFilter = require('../components/features/componentFilter');

  ComponentTableWrapper = require('../components/table/componentTableWrapper');

  ComponentTextInput = require('../components/features/componentTextInput');

  ComponentTableFactory = require('../components/table/componentTableFactory');

  ViewPeople = (function(_super) {
    __extends(ViewPeople, _super);

    function ViewPeople() {
      ViewPeople.__super__.constructor.call(this);
    }

    ViewPeople.prototype.render = function() {
      var divForm, filterData, form, mainWrapper, tableDiv, userTable, viewWrapper;
      ViewPeople.__super__.render.call(this);
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      viewWrapper = document.createElement('div');
      viewWrapper.className = "view-wraper";
      viewWrapper.innerHTML = "People Admin View";
      tableDiv = document.createElement('div');
      tableDiv.innerHTML = "Table of users";
      viewWrapper.appendChild(tableDiv);
      viewWrapper.appendChild(document.createElement('br'));
      divForm = document.createElement('div');
      divForm.innerHTML = "<br/><br/><br/><br/>ComponentFormAddUser...<br><br>";
      viewWrapper.appendChild(divForm);
      viewWrapper.appendChild(document.createElement('br'));
      filterData = ComponentFilterFormatter.factory.createTeamDropdownsData(this.helper.bulk.getDepartmentData(), this.helper.bulk.getTeamData());
      userTable = new ComponentTableWrapper(ComponentTableFactory.createUsersTable(), new ComponentFilter(filterData), new ComponentTextInput('Type name'));
      userTable.render(tableDiv);
      form = new ComponentFormAddUser();
      form.render(divForm);
      mainWrapper.appendChild(viewWrapper);
    };

    return ViewPeople;

  })(ViewBase);

  module.exports = ViewPeople;

}).call(this);
