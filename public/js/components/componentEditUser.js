(function() {
  var ComponentBase, ComponentCheckBox, ComponentDropdown, ComponentEditUser, ComponentFilter, ComponentFilterFormatter, Model, NotificationCenter, app, hrtool,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('./componentBase');

  Model = require('../models/model');

  ComponentCheckBox = require('./features/componentCheckBox');

  ComponentFilter = require('./features/componentFilter');

  ComponentDropdown = require('./features/componentDropdown');

  ComponentFilterFormatter = require('./features/componentFilterFormatter');

  NotificationCenter = require('./componentNotificationCenter');

  hrtool = require('../models/actions');

  app = require('../app');

  ComponentEditUser = (function(_super) {
    __extends(ComponentEditUser, _super);

    function ComponentEditUser(idUser, editable) {
      var infoModel, model, usersModel;
      this.idUser = idUser;
      this.editable = editable != null ? editable : false;
      this.addItem = __bind(this.addItem, this);
      this.onInfoLoad = __bind(this.onInfoLoad, this);
      this.onLoad = __bind(this.onLoad, this);
      ComponentEditUser.__super__.constructor.call(this);
      this.teams = [];
      this.checkboxes = [];
      model = new Model(ComponentEditUser.EventType.GET_USERS);
      this.setModel(model, ComponentEditUser.EventType.GET_USERS);
      hrtool.actions.getUserTeams(this.model, {
        id_user: idUser
      });
      infoModel = new Model(ComponentEditUser.EventType.GET_INFO);
      hrtool.actions.getBasicUserInfo(infoModel, {
        id_user: idUser
      });
      this.listen(ComponentEditUser.EventType.GET_INFO, infoModel, this.onInfoLoad);
      usersModel = new Model(ComponentEditUser.EventType.GET_USERS);
      hrtool.actions.getUsers(usersModel);
      this.listen(ComponentEditUser.EventType.GET_USERS, usersModel, this.onUsersLoad);
    }

    ComponentEditUser.prototype.onLoad = function(data) {
      this.teams = data;
      this.createTeamItems();
    };

    ComponentEditUser.prototype.onInfoLoad = function(data) {
      var dropData;
      if (this.editable === true) {
        this.userInfoWrapper.style.display = 'block';
      }
      this.nameInput = this.element.getElementsByClassName(ComponentEditUser.INPUT_NAME_CLASS)[0];
      this.surnameInput = this.element.getElementsByClassName(ComponentEditUser.INPUT_SURNAME_CLASS)[0];
      this.emailInput = this.element.getElementsByClassName(ComponentEditUser.INPUT_EMAIL_CLASS)[0];
      this.nameInput.value = data.first_name;
      this.surnameInput.value = data.last_name;
      this.emailInput.value = data.email;
      this.userRoleWrapper = this.element.getElementsByClassName(ComponentEditUser.USER_ROLE_WRAPPER_CLASS)[0];
      dropData = ComponentFilterFormatter.transform(app.bulk.userRoles, 'id_user_role', 'title');
      this.userRoleDropdown = new ComponentDropdown(dropData['']);
      this.addChild('userRoleDropDown', this.userRoleDropdown, {
        el: this.userRoleWrapper
      });
      this.userRoleDropdown.render(this.userRoleWrapper);
    };

    ComponentEditUser.prototype.onUsersLoad = function(data) {
      var item, users, usersData, _i, _len;
      users = {};
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        users[item.unique_id] = item;
      }
      this.buddySelectWrapper = this.element.getElementsByClassName(ComponentEditUser.BUDDY_SELECT_WRAPPER_CLASS)[0];
      usersData = ComponentFilterFormatter.factory.createUsersDropdownsData(app.bulk.departments, app.bulk.teams, users);
      this.buddyFilter = new ComponentFilter(usersData, ['department', 'team', 'user']);
      this.addChild('buddyFilter', this.buddyFilter, {
        el: this.buddySelectWrapper
      });
      this.buddyFilter.render(this.buddySelectWrapper);
    };

    ComponentEditUser.prototype.createDom = function() {
      var cancelButton, saveButton;
      this.element = this.helper.tpl.create('components/componentEditUser', {
        wrapperClass: ComponentEditUser.WRAPPER_CLASS,
        teamWrapper: ComponentEditUser.TEAM_WRAPPER_CLASS,
        newTeamWrapper: ComponentEditUser.NEW_TEAM_WRAPPER_CLASS,
        userInfoWrapper: ComponentEditUser.USER_INFO_WRAPPER_CLASS,
        inputName: ComponentEditUser.INPUT_NAME_CLASS,
        inputSurname: ComponentEditUser.INPUT_SURNAME_CLASS,
        inputEmail: ComponentEditUser.INPUT_EMAIL_CLASS,
        userRoleWrapper: ComponentEditUser.USER_ROLE_WRAPPER_CLASS,
        buddySelectWrapper: ComponentEditUser.BUDDY_SELECT_WRAPPER_CLASS,
        buttonDiv: ComponentEditUser.BUTTON_DIV_WRAPPER_CLASS,
        buttonCancel: ComponentEditUser.BUTTON_CANCEL_CLASS,
        buttonSave: ComponentEditUser.BUTTON_SAVE_CLASS
      });
      this.teamWrapper = this.element.getElementsByClassName(ComponentEditUser.TEAM_WRAPPER_CLASS)[0];
      this.newTeamWrapper = this.element.getElementsByClassName(ComponentEditUser.NEW_TEAM_WRAPPER_CLASS)[0];
      this.userInfoWrapper = this.element.getElementsByClassName(ComponentEditUser.USER_INFO_WRAPPER_CLASS)[0];
      this.buttonsWrapper = this.element.getElementsByClassName(ComponentEditUser.BUTTON_DIV_WRAPPER_CLASS)[0];
      if (this.editable === false) {
        this.userInfoWrapper.style.display = 'none';
        this.buttonsWrapper.style.display = 'none';
      }
      saveButton = this.element.getElementsByClassName(ComponentEditUser.BUTTON_SAVE_CLASS)[0];
      cancelButton = this.element.getElementsByClassName(ComponentEditUser.BUTTON_CANCEL_CLASS)[0];
      saveButton.addEventListener(ComponentBase.EventType.CLICK, (function(_this) {
        return function() {
          _this.handleSaveClick();
          return _this.fire(ComponentEditUser.EventType.SAVE, null);
        };
      })(this));
      cancelButton.addEventListener(ComponentBase.EventType.CLICK, (function(_this) {
        return function() {
          return _this.fire(ComponentEditUser.EventType.SAVE, null);
        };
      })(this));
    };

    ComponentEditUser.prototype.handleSaveClick = function() {
      return console.log('ukládám změny -> taky dodělat odeslání změn údajů na backend');
    };

    ComponentEditUser.prototype.createTeamItems = function() {
      var i, item, _i, _len, _ref;
      _ref = this.teams;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        item = _ref[i];
        this.teamWrapper.appendChild(this.getTeamItemDom(item, i));
      }
      if (this.teams.length === 0) {
        this.teamWrapper.innerHTML = 'There is no team this user is in';
      }
      if (this.editable === true) {
        this.createNewTeamDom();
      }
    };

    ComponentEditUser.prototype.getTeamItemDom = function(team, index) {
      var button, checkbox, div, span;
      div = document.createElement('div');
      div.className = ComponentEditUser.ITEM_WRAPPER_CLASS;
      span = document.createElement('span');
      span.innerHTML = "" + team.department + "/" + team.team;
      if (this.editable === true) {
        button = document.createElement('button');
        button.innerHTML = 'x';
        button.addEventListener(ComponentBase.EventType.CLICK, (function(_this) {
          return function(index) {
            return function(event) {
              var _ref, _ref1;
              _this.teams[index] = null;
              return (_ref = event.target.parentElement) != null ? (_ref1 = _ref.parentElement) != null ? _ref1.style.display = 'none' : void 0 : void 0;
            };
          };
        })(this)(index), false);
        span.appendChild(button);
      }
      checkbox = new ComponentCheckBox('Manager', team.is_admin, this.editable);
      this.checkboxes.push(checkbox);
      div.appendChild(checkbox.getElement());
      div.appendChild(span);
      return div;
    };

    ComponentEditUser.prototype.createNewTeamDom = function() {
      var button, data, _ref, _ref1;
      data = ComponentFilterFormatter.factory.createTeamDropdownsData(app != null ? (_ref = app.bulk) != null ? _ref.departments : void 0 : void 0, app != null ? (_ref1 = app.bulk) != null ? _ref1.teams : void 0 : void 0);
      this.newTeamFilter = new ComponentFilter(data, ['department', 'team']);
      this.addChild('teamFilter', this.newTeamFilter, {
        el: this.newTeamWrapper
      });
      this.newTeamFilter.render(this.newTeamWrapper);
      this.newTeamCheckBox = new ComponentCheckBox('Manager', true, true);
      this.addChild('newTeamCheckBox', this.newTeamCheckBox, {
        el: this.newTeamWrapper
      });
      this.newTeamCheckBox.render(this.newTeamWrapper);
      button = document.createElement('button');
      button.innerHTML = '+';
      button.className = 'down-left-corner';
      button.addEventListener(ComponentBase.EventType.CLICK, this.addItem, false);
      this.newTeamWrapper.appendChild(document.createElement('br'));
      this.newTeamWrapper.appendChild(button);
      this.newTeamWrapper.appendChild(document.createElement('br'));
    };

    ComponentEditUser.prototype.addItem = function() {
      var index, isIn, status, team, _i, _len, _ref;
      status = this.newTeamFilter.getStatus();
      if (status.team !== ComponentDropdown.EmptyOption) {
        isIn = false;
        _ref = this.teams;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          team = _ref[_i];
          if (status.team.id === (team != null ? team.id_team : void 0)) {
            isIn = true;
            break;
          }
        }
        if (isIn === false) {
          this.teams.push({
            is_admin: this.newTeamCheckBox.isChecked(),
            department: status.department.value,
            id_department: status.department.id,
            team: status.team.value,
            id_team: status.team.id
          });
          index = this.teams.length - 1;
          this.teamWrapper.appendChild(this.getTeamItemDom(this.teams[index], index));
        } else {
          this.addNotification('User is allready in this team!', ComponentBase.DEFAULT_NOTIFICATION_DURATION, NotificationCenter.EventType.error);
        }
      } else {
        this.addNotification('You have to choose a team!', ComponentBase.DEFAULT_NOTIFICATION_DURATION, NotificationCenter.EventType.error);
      }
    };

    return ComponentEditUser;

  })(ComponentBase);

  ComponentEditUser.WRAPPER_CLASS = 'edit-user';

  ComponentEditUser.ITEM_WRAPPER_CLASS = 'edit-user-team-item';

  ComponentEditUser.TEAM_WRAPPER_CLASS = 'team-wrapper';

  ComponentEditUser.NEW_TEAM_WRAPPER_CLASS = 'new-team-wrapper';

  ComponentEditUser.USER_INFO_WRAPPER_CLASS = 'user-info-wrapper';

  ComponentEditUser.INPUT_NAME_CLASS = 'input-name';

  ComponentEditUser.INPUT_SURNAME_CLASS = 'input-surname';

  ComponentEditUser.INPUT_EMAIL_CLASS = 'input-email';

  ComponentEditUser.USER_INFO_WRAPPER_CLASS = 'user-info-wrapper';

  ComponentEditUser.USER_ROLE_WRAPPER_CLASS = 'user-role-wrapper';

  ComponentEditUser.BUDDY_SELECT_WRAPPER_CLASS = 'buddy-select-wrapper';

  ComponentEditUser.BUTTON_DIV_WRAPPER_CLASS = 'buttons-wrapper';

  ComponentEditUser.BUTTON_CANCEL_CLASS = 'button-cancel';

  ComponentEditUser.BUTTON_SAVE_CLASS = 'button-save';

  ComponentEditUser.EventType = {
    GET_DATA: 'user/get-teams',
    GET_INFO: 'user/get-basic-info',
    GET_USERS: 'user/get-all',
    SAVE: 'save',
    CANCEL: 'cancel'
  };

  module.exports = ComponentEditUser;

}).call(this);
