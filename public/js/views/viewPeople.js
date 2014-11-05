(function() {
  var ComponentBase, ComponentFilter, ComponentFilterFormatter, ComponentPopupFactory, ComponentTableFactory, ComponentTableWrapper, ComponentTextInput, ViewBase, ViewPeople,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewBase = require('./viewBase');

  ComponentBase = require('../components/componentBase');

  ComponentPopupFactory = require('../components/componentPopupFactory');

  ComponentFilterFormatter = require('../components/features/componentFilterFormatter');

  ComponentFilter = require('../components/features/componentFilter');

  ComponentTableWrapper = require('../components/table/componentTableWrapper');

  ComponentTextInput = require('../components/features/componentTextInput');

  ComponentTableFactory = require('../components/table/componentTableFactory');

  ViewPeople = (function(_super) {
    __extends(ViewPeople, _super);

    function ViewPeople() {
      this.handleAddUserPopup = __bind(this.handleAddUserPopup, this);
      ViewPeople.__super__.constructor.call(this);
    }

    ViewPeople.prototype.render = function() {
      var addUserButton, filterData, mainWrapper, tableDiv, userTable, viewWrapper;
      ViewPeople.__super__.render.call(this);
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      viewWrapper = document.createElement('div');
      viewWrapper.className = "view-wraper";
      viewWrapper.innerHTML = "People Admin View";
      addUserButton = document.createElement('button');
      addUserButton.innerHTML = "Add new user";
      addUserButton.addEventListener(ComponentBase.CLICK_EVENT, this.handleAddUserPopup);
      viewWrapper.appendChild(addUserButton);
      viewWrapper.appendChild(document.createElement('br'));
      tableDiv = document.createElement('div');
      tableDiv.innerHTML = "Table of users";
      viewWrapper.appendChild(tableDiv);
      viewWrapper.appendChild(document.createElement('br'));
      filterData = ComponentFilterFormatter.factory.createTeamDropdownsData(this.helper.bulk.getDepartmentData(), this.helper.bulk.getTeamData());
      userTable = new ComponentTableWrapper(ComponentTableFactory.createUsersTable(), new ComponentFilter(filterData), new ComponentTextInput('Type name'));
      userTable.render(tableDiv);
      mainWrapper.appendChild(viewWrapper);
    };

    ViewPeople.prototype.handleAddUserPopup = function(ev) {
      var addUserPopup;
      addUserPopup = ComponentPopupFactory.getNewUserPopup();
      addUserPopup.open();
    };

    return ViewPeople;

  })(ViewBase);

  module.exports = ViewPeople;

}).call(this);
