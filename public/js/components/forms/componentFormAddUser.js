(function() {
  var ComponentBase, ComponentCheckBox, ComponentDropdown, ComponentFilter, ComponentFormAddUser, ComponentNotificationCenter, Model, app, formater, hrtool,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../componentBase');

  ComponentFilter = require('../features/componentFilter');

  formater = require('../features/componentFilterFormatter');

  ComponentDropdown = require('../features/componentDropdown');

  ComponentCheckBox = require('../features/componentCheckBox');

  Model = require('../../models/model');

  hrtool = require('../../models/actions');

  ComponentNotificationCenter = require('../../components/componentNotificationCenter');

  app = require('../../app');

  ComponentFormAddUser = (function(_super) {
    __extends(ComponentFormAddUser, _super);

    function ComponentFormAddUser() {
      this.handleFormSent = __bind(this.handleFormSent, this);
      this.handleSaveForm = __bind(this.handleSaveForm, this);
      this.setSelectedHR = __bind(this.setSelectedHR, this);
      var model;
      ComponentFormAddUser.__super__.constructor.call(this);
      this.isSelectedHRBuddy = false;
      model = new Model(ComponentFormAddUser.eventType.DATA_LOAD);
      this.setModel(model, ComponentFormAddUser.eventType.DATA_LOAD);
      hrtool.actions.getHR(this.model);
    }

    ComponentFormAddUser.prototype.createDom = function() {
      var buttonSave;
      this.element = this.helper.tpl.create("components/forms/componentFormAddUser");
      this.name = this.element.getElementsByClassName("input1")[0];
      this.surname = this.element.getElementsByClassName("input2")[0];
      this.email = this.element.getElementsByClassName("input3")[0];
      buttonSave = this.element.getElementsByClassName("form-add-user-saveButton")[0];
      buttonSave.addEventListener(ComponentBase.eventType.CLICK, this.handleSaveForm, false);
      this.placeHolderFilter = this.element.getElementsByClassName("form-add-user-filter")[0];
      this.placeHolderDrop = this.element.getElementsByClassName("form-add-user-drop")[0];
      this.addComponents(this.element.getElementsByClassName("form-add-user-column4")[0]);
      this.setFilterData();
    };

    ComponentFormAddUser.prototype.addComponents = function(wrapper) {
      this.checkBoxIsTeamAdmin = new ComponentCheckBox("is Team Admin");
      this.checkBoxIsHR = new ComponentCheckBox("is HR");
      this.addChild(this.checkBoxIsTeamAdmin.componentId, this.checkBoxIsTeamAdmin, {
        el: wrapper
      });
      this.addChild(this.checkBoxIsHR.componentId, this.checkBoxIsHR, {
        el: wrapper
      });
    };

    ComponentFormAddUser.prototype.setFilterData = function() {
      var departmentsData, roleData, teamsData, _ref, _ref1, _ref2;
      departmentsData = app != null ? (_ref = app.bulk) != null ? _ref.departments : void 0 : void 0;
      teamsData = app != null ? (_ref1 = app.bulk) != null ? _ref1.teams : void 0 : void 0;
      roleData = app != null ? (_ref2 = app.bulk) != null ? _ref2.departmentRoles : void 0 : void 0;
      this.data = formater.factory.createTeamRoleDropdownsData(departmentsData, roleData, teamsData);
      this.filterDepRoleTeam = new ComponentFilter(this.data);
      if (this.placeHolderFilter == null) {
        this.placeHolderFilter = document.createElement("div");
      }
      this.addChild(this.filterDepRoleTeam.componentId, this.filterDepRoleTeam, {
        el: this.placeHolderFilter
      });
      if (!this.rendered) {
        this.filterDepRoleTeam.render(this.placeHolderFilter);
      }
    };

    ComponentFormAddUser.prototype.onLoad = function(data) {
      var dropData;
      if (!data.error) {
        if (this.placeHolderDrop == null) {
          this.placeHolderDrop = document.createElement("div");
        }
        dropData = this.createDropDownData(data);
        if (!this.HRbuddys) {
          this.HRbuddys = new ComponentDropdown(dropData);
          this.addChild(this.HRbuddys.componentId, this.HRbuddys, {
            el: this.placeHolderDrop
          });
          this.listen(ComponentDropdown.eventType.CHANGE, this.HRbuddys, this.setSelectedHR);
          if (this.rendered != null) {
            this.HRbuddys.render(this.placeHolderDrop);
          }
        } else {
          this.HRbuddys.changeData(dropData);
          if (this.rendered != null) {
            this.HRbuddys.render(this.placeHolderDrop);
          }
        }
      } else {
        this.HRbuddys = new ComponentDropdown(ComponentDropdown.EmptyOption);
        this.addChild(this.HRbuddys.componentId, this.HRbuddys, {
          el: this.placeHolderDrop
        });
        if (this.rendered != null) {
          this.HRbuddys.render(this.placeHolderDrop);
        }
      }
    };

    ComponentFormAddUser.prototype.createDropDownData = function(data) {
      var d;
      d = data.map(function(item) {
        return {
          value: "" + item.last_name + " " + item.first_name,
          id: item.id_user
        };
      });
      return d;
    };

    ComponentFormAddUser.prototype.setSelectedHR = function(data) {
      this.isSelectedHRBuddy = data.id !== -1;
    };

    ComponentFormAddUser.prototype.handleSaveForm = function(data) {
      var model;
      if (this.isValid() === true) {
        data = {
          first_name: this.name.value,
          last_name: this.surname.value,
          email: this.email.value,
          is_admin: this.checkBoxIsTeamAdmin.checked,
          is_hr: this.checkBoxIsHR.checked,
          id_buddy: this.HRbuddys.selected.id,
          id_department_role: this.filterDepRoleTeam._status[1].id,
          id_team: this.filterDepRoleTeam._status[2].id
        };
        model = new Model(ComponentFormAddUser.eventType.SAVE);
        this.listen(ComponentFormAddUser.eventType.SAVE, model, this.handleFormSent);
        hrtool.actions.saveFormAddUser(model, data);
      }
    };

    ComponentFormAddUser.prototype.isValid = function() {
      var baseTime, div, dropDownButton, emptyEmail, err, i, status, _i, _len, _ref;
      err = true;
      baseTime = ComponentNotificationCenter.DEFAULT_TIME;
      if (this.name.value === "") {
        this.setInvalidInputClass(this.name);
        div = document.createElement("div");
        div.innerText = "Name is not filled.";
        this.addNotification(div, baseTime, ComponentNotificationCenter.eventType.error);
        baseTime += 1000;
        err = false;
      }
      if (this.surname.value === "") {
        this.setInvalidInputClass(this.surname);
        div = document.createElement("div");
        div.innerText = "Surname is not filled.";
        this.addNotification(div, baseTime, ComponentNotificationCenter.eventType.error);
        baseTime += 1000;
        err = false;
      }
      emptyEmail = false;
      if (this.email.value === "") {
        this.setInvalidInputClass(this.email);
        div = document.createElement("div");
        div.innerText = "Email is not filled.";
        this.addNotification(div, baseTime, ComponentNotificationCenter.eventType.error);
        baseTime += 1000;
        err = false;
        emptyEmail = true;
      }
      if (emptyEmail === false) {
        if (this.email.value.split("@").length !== 2 || this.email.value.split("@")[1].split(".").length !== 2) {
          this.setInvalidInputClass(this.email);
          div = document.createElement("div");
          div.innerText = "Bad format of email adress.";
          this.addNotification(div, baseTime, ComponentNotificationCenter.eventType.error);
          baseTime += 1000;
          err = false;
        }
      }
      _ref = this.filterDepRoleTeam._status;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        status = _ref[i];
        if (status.id === -1) {
          dropDownButton = document.getElementById("component-" + this.filterDepRoleTeam._dropdowns[i].componentId + "dropdown-button");
          switch (i) {
            case 0:
              this.setInvalidInputClass(dropDownButton);
              div = document.createElement("div");
              div.innerText = "Department is not selected.";
              this.addNotification(div, baseTime, ComponentNotificationCenter.eventType.error);
              baseTime += 1000;
              err = false;
              break;
            case 1:
              this.setInvalidInputClass(dropDownButton);
              div = document.createElement("div");
              div.innerText = "Role is not selected.";
              this.addNotification(div, baseTime, ComponentNotificationCenter.eventType.error);
              baseTime += 1000;
              err = false;
              break;
            case 2:
              this.setInvalidInputClass(dropDownButton);
              div = document.createElement("div");
              div.innerText = "Team is not selected.";
              this.addNotification(div, baseTime, ComponentNotificationCenter.eventType.error);
              baseTime += 1000;
              err = false;
          }
        }
      }
      if (!this.isSelectedHRBuddy) {
        this.HRbuddys.setInvalidInputClass();
        div = document.createElement("div");
        div.innerText = "HR buddy is not selected.";
        this.addNotification(div, baseTime, ComponentNotificationCenter.eventType.error);
        baseTime += 1000;
        err = false;
      }
      return err;
    };

    ComponentFormAddUser.prototype.handleFormSent = function(data) {
      var div, model;
      if (!data.error) {
        this.helper["debugger"]("FormStatus: Form sent");
        div = document.createElement("div");
        div.innerText = "User Added";
        this.addNotification(div, ComponentNotificationCenter.DEFAULT_TIME, ComponentNotificationCenter.eventType.success);
        if (this.checkBoxIsHR.checked === true) {
          model = new Model(ComponentFormAddUser.eventType.DATA_LOAD);
          this.setModel(model, ComponentFormAddUser.eventType.DATA_LOAD);
          hrtool.actions.getHR(this.model);
        }
        this.reset();
        this.fire(ComponentFormAddUser.eventType.SAVE, null);
      } else {
        this.helper["debugger"]("FormStatus: Err", data.error);
        div = document.createElement("div");
        div.innerText = "User Not Added Error:" + data.error;
        this.addNotification(div, ComponentNotificationCenter.DEFAULT_TIME, ComponentNotificationCenter.eventType.error);
      }
    };

    ComponentFormAddUser.prototype.reset = function() {
      this.name.value = "";
      this.surname.value = "";
      this.email.value = "";
      this.name.focus();
      this.filterDepRoleTeam.unselectAll();
      this.checkBoxIsTeamAdmin.setChecked(false);
      this.checkBoxIsHR.setChecked(false);
      this.HRbuddys.setSelection(ComponentDropdown.EmptyOption);
      this.isSelectedHRBuddy = false;
    };

    return ComponentFormAddUser;

  })(ComponentBase);

  ComponentFormAddUser.eventType = {
    SAVE: 'formSave',
    DATA_LOAD: 'data-load'
  };

  module.exports = ComponentFormAddUser;

}).call(this);
