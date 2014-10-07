var ComponentBase = require('./../../componentBase');
var Model = require('../../../models/model');
var ComponentFilter = require('./../componentFilter');
var hrtool = require('../../../models/actions');
var helper = require('../../../helpers/helpers');
var ComponentFilterFormatter = require('./../componentFilterFormatter');
var ComponentNotificationCenter = require('./../../componentNotificationCenter');

var ComponentTaskImplicit =  module.exports  = function (data) {
    this.super = ComponentBase;
    this.super.call(this);
    this.data = data;
};
ComponentTaskImplicit.prototype = new ComponentBase();
ComponentTaskImplicit.prototype.constructor = ComponentTaskImplicit;

ComponentTaskImplicit.prototype.createDom = function () {
    var divsName = ComponentTaskImplicit.ListDivs;
    var dropDownData = ComponentFilterFormatter.factory.createTeamDropdowns(this.helper.bulk.getData(['departments']), this.helper.bulk.getData(['teams']));
    var dataMap = this._getSelectedItem(this.data, dropDownData);
    this.dropdown = new ComponentFilter(dataMap.dd, ['department', 'teams']);
    this.buddy_dropdown = new ComponentFilter(dataMap.dd, ['department', 'teams']);

    var jadeTitle = {
        wrapper: {
            className: divsName.title
        },
        data:{
            text: this.data.title
        }
    };
    var jadeDaT = {
        wrapper: {
            className: divsName.department_team
        }
    };
    var jadeBuddyDaT = {
        wrapper: {
            className: divsName.buddy_department_team
        }
    };
    var jadeStart = {
        wrapper: {
            className: divsName.task_start
        },
        data:{
            text: this.data.title,
            className: divsName.task_start + " text"
        }
    };
    var jadeLength = {
        wrapper: {
            className: divsName.task_length
        },
        data:{
            text: this.data.title,
            className:  divsName.task_length + " text"
        }
    };
    var jadeSave = {
        wrapper: {
            className: divsName.route
        }
    };
    var jadeData = {
        title: jadeTitle,
        dAt: jadeDaT,
        bDaT: jadeBuddyDaT,
        start: jadeStart,
        length: jadeLength,
        save: jadeSave
    };

    var wrapper = helper.tpl.create("components/features/addTask/componentTaskImplicit", jadeData);
    //wrapper.appendChild(wrapper);
    this.element = wrapper;

    //Create Department and Team
    var div = wrapper.getElementsByClassName(divsName.department_team)[0];
    this.addChild(divsName.department_team + this.dropdown.componentId, this.dropdown, {el: div});
    this.dropdown.render(div);

    //Create buddy Department and Team
    div = wrapper.getElementsByClassName(divsName.buddy_department_team)[0];
    this.addChild(divsName.buddy_department_team + this.dropdown.componentId, this.buddy_dropdown, {el: div});
    this.buddy_dropdown.render(div);

    //create task start at
    div = wrapper.getElementsByClassName(divsName.task_start)[0];
    div.addEventListener(ComponentBase.EventType.ONKEYPRESS, function(event){event.returnValue = helper.number.isNumber(String.fromCharCode(event.keyCode),1,"")});

    //create task length
    div = wrapper.getElementsByClassName(divsName.task_length)[0];
    div.addEventListener(ComponentBase.EventType.ONKEYPRESS, function(event){event.returnValue = helper.number.isNumber(String.fromCharCode(event.keyCode),1,"")});

    wrapper.addEventListener(ComponentBase.EventType.CLICK, this.handleOnClick.bind(this));
};

ComponentTaskImplicit.prototype._getSelectedItem = function (data, dropDownData) {
    var map = {
        data: data,
        dd: JSON.parse(JSON.stringify(dropDownData)) //create copy of dropdown data, because multiple select....
    };
    if (data.id_department != null) {
        map.dd[0][""][this._getIdForSelected(map.dd[0][""], data.id_department)]['selected'] = "true";
    }/*
     if ((data.id_team != null) && (data.id_department == null)) {
     map.dd[1]["global"][this._getIdForSelected(map.dd[1]["global"], data.id_team)]['selected'] = "true";
     }*/
    if (data.id_team != null) {
        map.dd[1][data.id_department][this._getIdForSelected(map.dd[1][data.id_department], data.id_team)]['selected'] = "true";
    }
    return map;
};

ComponentTaskImplicit.prototype._getIdForSelected = function (arr, key) {
    for (var d = 0; d < arr.length; d++) {
        if (arr[d].id == key)
            return d
    }
    return null;
};


ComponentTaskImplicit.prototype.handleOnClick = function (ev) {
    var target = ev.target;
    var rowEl;
    if (rowEl = helper.dom.getParentByClass(target, "implicit-task")) {
        var objectData = {
            object: target,
            rowEl: rowEl};
        if (target.classList.contains("save")) {
            this.handleButtonSave(objectData);
        }
        else if (target.classList.contains("title")) {
            this.handleEditText(objectData);
        }
        else if (target.classList.contains("length")) {
            this.handleEditText(objectData);
        }
        else if (target.classList.contains("dropDownItem")) {
            rowEl.getElementsByClassName("save")[0].innerHTML = "Add";
        }
    }
};

ComponentTaskImplicit.prototype.handleEditText = function (data) {
    data.object.disabled = false;
    data.object.focus();
    data.rowEl.getElementsByClassName("save")[0].innerHTML = "Add";
};

ComponentTaskImplicit.prototype.handleButtonSave = function (data) {
    data.object.innerHTML = "Saving";
    var lengthEl = data.rowEl.getElementsByClassName(ComponentTaskImplicit.ListDivs.task_length + " text")[0];
    var start = data.rowEl.getElementsByClassName(ComponentTaskImplicit.ListDivs.task_start + " text")[0];
    var error = false;
    if (lengthEl.value == "") {
        var newDiv = document.createElement('div');
        newDiv.innerHTML = "Length of implicit task must me a number";
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.EventType.error);
        this.setInvalidInputClass(lengthEl);
        error = true;
    }
    if (start.value == "") {
        var newDiv = document.createElement('div');
        newDiv.innerHTML = "start day of implicit task must me a number";
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.EventType.error);
        this.setInvalidInputClass(start);
        error = true;
    }

    if (!error) {
        var dropStatus = this.dropdown.getStatus();
        var dep = dropStatus["department"].id;
        var team = dropStatus["teams"].id;
        var buddyDropStatus = this.buddy_dropdown.getStatus();
        var buddyDep = buddyDropStatus["department"].id;
        var buddyTeam = buddyDropStatus["teams"].id;
        var saveData = {
            id_task_template: this.data.id_task_template,
            id_team: null,
            id_department: null,
            start_day:parseInt(start.value),
            duration: parseInt(lengthEl.value),
            id_department_role: helper.bulk.getData(["user","id_department_role"]),
            id_buddy_department: null,
            id_buddy_team: null
        };
        if (dep != "-1") {
            saveData['id_department'] = dep;
        }
        if (team != "-1") {
            saveData['id_team'] = team;
        }
        if (buddyDep != "-1") {
            saveData['id_buddy_department'] = buddyDep;
        }
        if (buddyTeam != "-1") {
            saveData['id_buddy_team'] = buddyTeam;
        }
        start.value = "";
        lengthEl.value = "";
        var saveModel = new Model(ComponentTaskImplicit.EventType.DATA_ADD);
        this.listen(ComponentTaskImplicit.EventType.DATA_ADD, saveModel, this.onSave.bind(this, data.object));
        hrtool.actions.saveImplicitTaskData(saveModel, saveData);
    }
};

ComponentTaskImplicit.prototype.onSave = function (objEl, data) {
    if (data.error) {
        var newDiv = document.createElement('div');
        newDiv.innerHTML = "Critical error! Please contact administrator!";
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.EventType.error);

    }
    else {
        objEl.innerHTML = "Add";
        var newDiv = document.createElement('div');
        newDiv.innerHTML = "Implicit task has been successfully added.";
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.EventType.success);
    }
};

ComponentTaskImplicit.ListDivs = {
    title: "title",
    department_team: "department-and-team",
    buddy_department_team: "buddy_department-and-team",
    task_start: "start",
    task_length: "length",
    route: "route"
};

ComponentTaskImplicit.EventType = {
    DATA_ADD: 'implicit/add'
};