(function() {
  var ComponentBase, ComponentFilter, ComponentFilterFormatter, ComponentNotificationCenter, ComponentTemplateList, Model, helper, hrtool,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('./../componentBase');

  Model = require('../../models/model');

  ComponentFilter = require('./../features/componentFilter');

  helper = require('../../helpers/helpers');

  ComponentFilterFormatter = require('./../features/componentFilterFormatter');

  hrtool = require('../../models/actions');

  ComponentNotificationCenter = require('./../componentNotificationCenter');

  ComponentTemplateList = (function(_super) {
    __extends(ComponentTemplateList, _super);

    function ComponentTemplateList() {
      this.onDelete = __bind(this.onDelete, this);
      this.onSave = __bind(this.onSave, this);
      this.handleOnClick = __bind(this.handleOnClick, this);
      ComponentTemplateList.__super__.constructor.call(this);
      this.data = null;
      this.dropdowns = {};
    }

    ComponentTemplateList.prototype.createDom = function() {
      var wrapper;
      wrapper = document.createElement('div');
      wrapper.className = "template-list";
      wrapper.innerHTML = "Loading... Please wait";
      return this.element = wrapper;
    };

    ComponentTemplateList.prototype.onLoad = function(data) {
      var dataMap, dropDownData, item, jadeHeader, jadeHeaderData, _i, _len;
      this.element.innerHTML = "";
      this.data = data;
      dropDownData = ComponentFilterFormatter.factory.createTeamDropdownsData(this.helper.bulk.getData(['departments']), this.helper.bulk.getData(['teams']));
      jadeHeaderData = {
        header: true,
        data: {
          items: ComponentTemplateList.TemplateListDivs
        }
      };
      jadeHeader = helper.tpl.create("components/templateList/componentTemplateList", jadeHeaderData);
      this.getElement().appendChild(jadeHeader);
      this.getElement().addEventListener(ComponentBase.eventType.CLICK, this.handleOnClick);
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        dataMap = this._getSelectedItem(item, dropDownData);
        this.addRow(dataMap);
      }
    };

    ComponentTemplateList.prototype.addRow = function(data) {
      var div, divsName, dropdown, id, jadeDaT, jadeData, jadeDelete, jadeDesc, jadeRow, jadeSave, jadeTask, jadeTitle;
      id = data.data.id_task_template;
      divsName = ComponentTemplateList.TemplateListDivs;
      dropdown = new ComponentFilter(data.dd, ['department', 'teams']);
      this.dropdowns[id] = dropdown;
      jadeRow = {
        wrapper: {
          className: "row",
          atribut: id
        }
      };
      jadeTitle = {
        wrapper: {
          className: divsName.title
        },
        data: {
          className: divsName.title + " text",
          value: data.data[divsName.title]
        }
      };
      jadeDesc = {
        wrapper: {
          className: divsName.description
        },
        data: {
          className: divsName.description + " text",
          value: data.data[divsName.description]
        }
      };
      jadeDaT = {
        wrapper: {
          className: divsName.id_department
        }
      };
      jadeSave = {
        wrapper: {
          className: divsName.route
        }
      };
      jadeDelete = {
        data: {
          implicit: !!data.data.implicit
        }
      };
      jadeData = {
        row: jadeRow,
        title: jadeTitle,
        desc: jadeDesc,
        dAt: jadeDaT,
        save: jadeSave,
        bdelete: jadeDelete
      };
      jadeTask = helper.tpl.create("components/templateList/componentTemplateList", jadeData);
      this.getElement().appendChild(jadeTask);
      div = jadeTask.getElementsByClassName(divsName.id_department)[0];
      this.addChild(divsName.id_department + dropdown.componentId, dropdown, {
        el: div
      });
      dropdown.render(div);
      return jadeTask;
    };

    ComponentTemplateList.prototype._getSelectedItem = function(data, dropDownData) {
      var map;
      map = {
        data: data,
        dd: JSON.parse(JSON.stringify(dropDownData))
      };
      if (data.id_department) {
        map.dd[0][""][this._getIdForSelected(map.dd[0][""], data.id_department)]['selected'] = "true";
      }
      if (data.id_team) {
        map.dd[1][data.id_department][this._getIdForSelected(map.dd[1][data.id_department], data.id_team)]['selected'] = "true";
      }
      return map;
    };

    ComponentTemplateList.prototype._getIdForSelected = function(arr, key) {
      var i, item, _i, _len;
      for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
        item = arr[i];
        if (item.id === key) {
          return i;
        }
      }
      return null;
    };

    ComponentTemplateList.prototype.handleOnClick = function(ev) {
      var id, objectData, rowEl, target;
      target = ev.target;
      rowEl = helper.dom.getParentByClass(target, "row");
      if (rowEl) {
        id = rowEl.getAttribute("data-template-id");
        objectData = {
          object: target,
          id: id,
          rowEl: rowEl
        };
        if (target.classList.contains("delete")) {
          this.handleButtonDelete(objectData);
        } else if (target.classList.contains("save")) {
          this.handleButtonSave(objectData);
        } else if (target.classList.contains("title")) {
          this.handleEditText(objectData);
        } else if (target.classList.contains("description")) {
          this.handleEditText(objectData);
        } else if (target.classList.contains("dropDownItem")) {
          rowEl.getElementsByClassName("save")[0].innerHTML = "Save";
        }
      }
    };

    ComponentTemplateList.prototype.handleEditText = function(data) {
      return data.rowEl.getElementsByClassName("save")[0].innerHTML = "Save";
    };

    ComponentTemplateList.prototype.handleButtonSave = function(data) {
      var dep, descEl, dropStatus, error, newDiv, saveData, saveModel, team, titleEl;
      titleEl = data.rowEl.getElementsByClassName(ComponentTemplateList.TemplateListDivs.title + " text")[0];
      descEl = data.rowEl.getElementsByClassName(ComponentTemplateList.TemplateListDivs.description + " text")[0];
      dropStatus = this.dropdowns[data.id].getStatus();
      error = false;
      if (titleEl.value === "") {
        error = true;
        newDiv = document.createElement('div');
        newDiv.innerHTML = "Title must not be empty!";
        this.setInvalidInputClass(titleEl);
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.eventType.error);
      }
      if (!error) {
        data.object.innerHTML = "Saving";
        dep = dropStatus["department"].id;
        team = dropStatus["teams"].id;
        saveData = {
          title: titleEl.value,
          id_task_template: parseInt(data.id),
          description: descEl.value,
          id_team: null,
          id_department: null
        };
        if (dep !== "-1") {
          saveData['id_department'] = dep;
        }
        if (team !== "-1") {
          saveData['id_team'] = team;
        }
        saveModel = new Model(ComponentTemplateList.eventType.DATA_SAVE);
        this.listen(ComponentTemplateList.eventType.DATA_SAVE, saveModel, (function(_this) {
          return function(backendData) {
            return _this.onSave(data.object, backendData);
          };
        })(this));
        hrtool.actions.saveDefaultTaskData(saveModel, saveData);
      }
    };

    ComponentTemplateList.prototype.handleButtonDelete = function(data) {
      var deleteModel, newDiv;
      if (data.object.getAttribute("implicit") === "true") {
        newDiv = document.createElement('div');
        newDiv.innerHTML = "Implicit task cannot be deleted";
        return this.addNotification(newDiv, 3000, ComponentNotificationCenter.eventType.error);
      } else {
        deleteModel = new Model(ComponentTemplateList.eventType.DATA_DELETE);
        this.listen(ComponentTemplateList.eventType.DATA_DELETE, deleteModel, (function(_this) {
          return function(backendData) {
            return _this.onDelete(data.object, backendData);
          };
        })(this));
        return hrtool.actions.deleteDefaultTaskData(deleteModel, {
          id_task_template: parseInt(data.id)
        });
      }
    };

    ComponentTemplateList.prototype.onSave = function(objEl, data) {
      var newDiv;
      if (data.name && data.name === 'error') {
        objEl.disabled = false;
        newDiv = document.createElement('div');
        newDiv.innerHTML = "Critical error! Please contact your administrator!";
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.eventType.error);
      } else {
        objEl.innerHTML = "Save";
        newDiv = document.createElement('div');
        newDiv.innerHTML = "Task has been successfuly saved.";
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.eventType.success);
      }
    };

    ComponentTemplateList.prototype.onDelete = function(objEl, data) {
      var newDiv, rowEl;
      if (data.name && data.name === 'error') {
        objEl.disabled = false;
        newDiv = document.createElement('div');
        newDiv.innerHTML = "Critical error! Please contact your administrator!";
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.eventType.error);
      } else {
        document.body.removeEventListener(ComponentBase.eventType.CLICK, this.onDelete, false);
        this.dropdowns[data[0].id_task_template].destroy();
        rowEl = helper.dom.getParentByClass(objEl, "row");
        rowEl.innerHTML = "";
        newDiv = document.createElement('div');
        newDiv.innerHTML = "Task has been successfuly deleted.";
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.eventType.success);
      }
    };

    return ComponentTemplateList;

  })(ComponentBase);

  ComponentTemplateList.TemplateListDivs = {
    title: "title",
    description: "description",
    id_department: "department-and-team",
    route: "route"
  };

  ComponentTemplateList.eventType = {
    DATA_LOAD: 'template/get-all',
    DATA_SAVE: 'template/update',
    DATA_DELETE: 'template/delete'
  };

  module.exports = ComponentTemplateList;

}).call(this);
