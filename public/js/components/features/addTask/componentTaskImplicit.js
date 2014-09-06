var ComponentBase = require('./../../componentBase');
var Model = require('../../../models/model');
var ComponentFilter = require('./../componentFilter');
var hrtool = require('../../../models/actions');
var helper = require('../../../helpers/helpers');
var ComponentFilterFormatter = require('./../componentFilterFormatter');

var ComponentTaskImplicit =  module.exports  = function (data) {
    this.super = ComponentBase;
    this.super.call(this);
    this.data = data;
};
ComponentTaskImplicit.prototype = new ComponentBase();
ComponentTaskImplicit.prototype.constructor = ComponentTaskImplicit;

ComponentTaskImplicit.prototype.createDom = function () {
    var wrapper = document.createElement('div');
    var divsName = ComponentTaskImplicit.ListDivs;
    var dropDownData = ComponentFilterFormatter.factory.createTeamDropdowns(this.helper.bulk.getData(['departments']), this.helper.bulk.getData(['teams']));
    var dataMap = this._getSelectedItem(this.data, dropDownData);
    this.dropdown = new ComponentFilter(dataMap.dd, ['department', 'teams']);
    wrapper.className = "implicit-task";
    this.element = wrapper;

    var div = document.createElement("div");
    var span = document.createElement("span");
    var el = document.createElement('span');


    //create Title
    span.className = "head";
    span.innerText = "Title:";
    div.className = divsName.title;
    el.innerText = this.data.title;
    div.appendChild(span);
    div.appendChild(el);
    wrapper.appendChild(div);

    //Create Department and Team
    div = document.createElement("div");
    span = document.createElement("span");
    div.className = divsName.department_team;
    span.className = "head";
    span.innerText = "Department and Team:";
    div.appendChild(span);
    wrapper.appendChild(div);
    this.addChild(divsName.department_team + this.dropdown.componentId, this.dropdown, {el: div});
    this.dropdown.render(div);

    //create task start at
    div = document.createElement("div");
    span = document.createElement("span");
    div.className = divsName.task_start;
    el = document.createElement('input');
    el.type = "number";
    span.className = "head";
    span.innerText = "Task length(days):";
    el.addEventListener(ComponentBase.EventType.ONKEYPRESS, function(event){event.returnValue = helper.number.isNumber(String.fromCharCode(event.keyCode),1,"")});
    el.className = divsName.task_start + " text";
    el.setAttribute("min", "0");
    el.value = "1";
    div.appendChild(span);
    div.appendChild(el);
    wrapper.appendChild(div);

    //create task length
    div = document.createElement("div");
    span = document.createElement("span");
    el = document.createElement('input');
    span.className = "head";
    div.className = divsName.task_length;
    el.type = "number";
    span.innerText = "Task length(days):";
    el.addEventListener(ComponentBase.EventType.ONKEYPRESS, function(event){event.returnValue = helper.number.isNumber(String.fromCharCode(event.keyCode),1,"")});
    el.className = divsName.task_length + " text";
    el.setAttribute("min", "0");
    el.value = "1";
    div.appendChild(span);
    div.appendChild(el);
    wrapper.appendChild(div);

    //create save button
    div = document.createElement("div");
    div.className = divsName.route;
    span.className = "head";
    var butEl = document.createElement("button");
    butEl.className = "button save";
    butEl.innerHTML = "Save";
    div.appendChild(butEl);
    wrapper.appendChild(div);

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

ComponentTaskImplicit.prototype.getDateNow = function(){
    var time = new Date().toLocaleDateString().split(".");
    if(time[1].length == 1)
        time[1] = "0" + time[1];
    if(time[0].length == 1)
        time[0] = "0" + time[0];
    return {
        "year": time[2],
        "month": time[1],
        "day": time[0],
        "toString": time[2] + "-" + time[1] + "-" + time[0]
    };
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
            rowEl.getElementsByClassName("save").item().innerHTML = "Save";
        }
    }
};

ComponentTaskImplicit.prototype.handleEditText = function (data) {
    data.object.disabled = false;
    data.object.focus();
    data.rowEl.getElementsByClassName("save").item().innerHTML = "Save";
};

ComponentTaskImplicit.prototype.handleButtonSave = function (data) {
    data.object.innerHTML = "Saving";
    var lengthEl = data.rowEl.getElementsByClassName(ComponentTaskImplicit.ListDivs.task_length + " text").item();
    var start = data.rowEl.getElementsByClassName(ComponentTaskImplicit.ListDivs.task_start + " text").item();

    if (lengthEl.value != "") {
        var dropStatus = this.dropdown.getStatus();
        var dep = dropStatus["department"].id;
        var team = dropStatus["teams"].id;
        var saveData = {
            id_task_template: this.data.id_task_template,
            id_team: null,
            id_department: null,
            start_day:parseInt(start.value),
            duration: parseInt(lengthEl.value),
            id_department_role: helper.bulk.getData(["user","id_department_role"])
        };
        if (dep != "-1") {
            saveData['id_department'] = dep;
        }
        if (team != "-1") {
            saveData['id_team'] = team;
        }
        var saveModel = new Model(ComponentTaskImplicit.EventType.DATA_ADD);
        this.listen(ComponentTaskImplicit.EventType.DATA_ADD, saveModel, this.onSave.bind(this, data.object));
        console.log("Temporary saved co CL", saveData);
        hrtool.actions.saveImplicitTaskData(saveModel, saveData);
    }
    else
        data.object.innerHTML = "Error"; //TODO: waiting for notification center

};

ComponentTaskImplicit.prototype.onSave = function (objEl, data) {
    if (data.error) {
        objEl.disabled = false;
    }
    else {
        helper.dom.getParentByClass(objEl,"implicit-task").innerHTML = "Implicit task has been successfully Saved.";
    }
};

ComponentTaskImplicit.ListDivs = {
    title: "title",
    department_team: "department-and-team",
    task_start: "start",
    task_length: "length",
    route: "route"
};

ComponentTaskImplicit.EventType = {
    DATA_ADD: 'implicit/add'
};