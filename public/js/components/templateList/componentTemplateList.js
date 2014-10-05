var ComponentBase = require('./../componentBase');
var Model = require('../../models/model');
var ComponentFilter = require('./../features/componentFilter');
var helper = require('../../helpers/helpers');
var ComponentFilterFormatter = require('./../features/componentFilterFormatter');
var hrtool = require('../../models/actions');
var ComponentNotificationCenter = require('./../componentNotificationCenter');

var ComponentTemplateList =  module.exports  = function () {
    this.super = ComponentBase;
    this.super.call(this);
    this.data = null;
    this.dropdowns = {};
};
ComponentTemplateList.prototype = new ComponentBase();
ComponentTemplateList.prototype.constructor = ComponentTemplateList;
ComponentTemplateList.prototype.createDom = function() {
    var wrapper = document.createElement('div');
    wrapper.className = "template-list";
    wrapper.innerHTML = "Loading... Please wait";
    this.element = wrapper;
};

ComponentTemplateList.prototype.onLoad = function (data) {
    this.element.innerHTML = "";
    this.data = data;
    var dropDownData = ComponentFilterFormatter.factory.createTeamDropdownsData(this.helper.bulk.getData(['departments']), this.helper.bulk.getData(['teams']));

    //Creating header titles and append to the div
    jadeHeaderData = {
        header: true,
        data: {
            items: ComponentTemplateList.TemplateListDivs
        }
    };
    var jadeHeader = helper.tpl.create("components/templateList/componentTemplateList", jadeHeaderData);
    this.getElement().appendChild(jadeHeader);

    //add eventlistener onClick
    this.getElement().addEventListener(ComponentBase.EventType.CLICK, this.handleOnClick.bind(this));

    //creating tasks
    for (var i = 0; i < this.data.length; i++) {
        var dataMap = this._getSelectedItem(data[i], dropDownData);
        this.addRow(dataMap);
    }
};

ComponentTemplateList.prototype.addRow = function (data) {

    var id = data.data.id_task_template;
    var divsName = ComponentTemplateList.TemplateListDivs;
    var dropdown = new ComponentFilter(data.dd, ['department', 'teams']);
    this.dropdowns[id] = dropdown;
    var jadeRow = {
        wrapper: {
            className: "row",
            atribut: id
        }
    };

    var jadeTitle = {
        wrapper: {
            className: divsName.title
        },
        data: {
            className: divsName.title + " text",
            value: data.data[divsName.title]
        }
    };

    var jadeDesc = {
        wrapper: {
            className: divsName.description
        },
        data: {
            className: divsName.description + " text",
            value: data.data[divsName.description]
        }
    };
    var jadeDaT = {
        wrapper: {
            className: divsName.id_department
        }
    };

    var jadeSave = {
        wrapper: {
            className: divsName.route
        }
    };
    var jadeDelete = {
        data:{
            implicit: !!data.data.implicit
        }
    };

    var jadeData = {
        //wrapper: jadeWrapper,
        row: jadeRow,
        title: jadeTitle,
        desc: jadeDesc,
        dAt: jadeDaT,
        save: jadeSave,
        bdelete: jadeDelete
    };

    var jadeTask = helper.tpl.create("components/templateList/componentTemplateList", jadeData);
    this.getElement().appendChild(jadeTask); //because I need addChild to exist div

    //create department and team
    var div = jadeTask.getElementsByClassName(divsName.id_department)[0];
    this.addChild(divsName.id_department + dropdown.componentId, dropdown, {el: div});
    dropdown.render(div);
    return jadeTask;
};

ComponentTemplateList.prototype._getSelectedItem = function (data, dropDownData) {
    var map = {
        data: data,
        dd: JSON.parse(JSON.stringify(dropDownData)) //create copy of dropdown data, because multiple select....
    };
    if (data.id_department != null) {
        map.dd[0][""][this._getIdForSelected(map.dd[0][""], data.id_department)]['selected'] = "true";
    }
    /*if ((data.id_team != null) && (data.id_department == null)) {
     map.dd[1]["global"][this._getIdForSelected(map.dd[1]["global"], data.id_team)]['selected'] = "true";
     }*/
    if (data.id_team != null) {
        map.dd[1][data.id_department][this._getIdForSelected(map.dd[1][data.id_department], data.id_team)]['selected'] = "true";
    }
    return map;
};

ComponentTemplateList.prototype._getIdForSelected = function (arr, key) {
    for (var d = 0; d < arr.length; d++) {
        if (arr[d].id == key)
            return d
    }
    return null;
};

ComponentTemplateList.prototype.handleOnClick = function (ev) {
    var target = ev.target;
    var rowEl;
    if (rowEl = helper.dom.getParentByClass(target, "row")) {
        var id = rowEl.getAttribute("data-template-id");
        var objectData = {
            object: target,
            id: id,
            rowEl: rowEl};
        if (target.classList.contains("delete")) {
            this.handleButtonDelete(objectData);
        }
        else if (target.classList.contains("save")) {
            this.handleButtonSave(objectData);
        }
        else if (target.classList.contains("title")) {
            this.handleEditText(objectData);
        }
        else if (target.classList.contains("description")) {
            this.handleEditText(objectData);
        }
        else if (target.classList.contains("dropDownItem")) {
            rowEl.getElementsByClassName("save")[0].innerHTML = "Save";
        }
    }
};

ComponentTemplateList.prototype.handleEditText = function (data) {
    data.rowEl.getElementsByClassName("save")[0].innerHTML = "Save";
};

ComponentTemplateList.prototype.handleButtonSave = function (data) {

    var titleEl = data.rowEl.getElementsByClassName(ComponentTemplateList.TemplateListDivs.title + " text")[0];
    var descEl = data.rowEl.getElementsByClassName(ComponentTemplateList.TemplateListDivs.description + " text")[0];
    var dropStatus = this.dropdowns[data.id].getStatus();
    var error = false;
    if(titleEl.value == ""){
        error = true;
        var newDiv = document.createElement('div');
        newDiv.innerHTML = "Title must not be empty!";
        this.setInvalidInputClass(titleEl);
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.EventType.error);
    }
    if(!error) {
        data.object.innerHTML = "Saving";
        var dep = dropStatus["department"].id;
        var team = dropStatus["teams"].id;
        var saveData = {
            title: titleEl.value,
            id_task_template: parseInt(data.id),
            description: descEl.value,
            id_team: null,
            id_department: null
        };
        if (dep != "-1") {
            saveData['id_department'] = dep;
        }
        if (team != "-1") {
            saveData['id_team'] = team;
        }
        var saveModel = new Model(ComponentTemplateList.EventType.DATA_SAVE);
        this.listen(ComponentTemplateList.EventType.DATA_SAVE, saveModel, this.onSave.bind(this, data.object));
        hrtool.actions.saveDefaultTaskData(saveModel, saveData);
    }
};

ComponentTemplateList.prototype.handleButtonDelete = function (data) {
    if(data.object.getAttribute("implicit") == "true"){
        var newDiv = document.createElement('div');
        newDiv.innerHTML = "Implicit task cannot be deleted";
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.EventType.error);
    }
    else{
        var deleteModel = new Model(ComponentTemplateList.EventType.DATA_DELETE);
        this.listen(ComponentTemplateList.EventType.DATA_DELETE, deleteModel, this.onDelete.bind(this, data.object));
        hrtool.actions.deleteDefaultTaskData(deleteModel, {id_task_template: parseInt(data.id)});
    }
};

ComponentTemplateList.prototype.onSave = function (objEl, data) {
    if (data.error) {
        objEl.disabled = false;
        var newDiv = document.createElement('div');
        newDiv.innerHTML = "Critical error! Please contact your administrator!";
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.EventType.error);
    }
    else {
        objEl.innerHTML = "Save";
        var newDiv = document.createElement('div');
        newDiv.innerHTML = "Task has been successfuly saved.";
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.EventType.success);
    }
};

ComponentTemplateList.prototype.onDelete = function (objEl, data) {
    if (data.error) {
        objEl.disabled = false;
        var newDiv = document.createElement('div');
        newDiv.innerHTML = "Critical error! Please contact your administrator!";
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.EventType.error);
    }

    else {
        document.body.removeEventListener(ComponentBase.EventType.CLICK, this.onDelete, false);
        this.dropdowns[data[0].id_task_template].destroy();
        var rowEl = helper.dom.getParentByClass(objEl, "row");
        rowEl.innerHTML = "";
        var newDiv = document.createElement('div');
        newDiv.innerHTML = "Task has been successfuly deleted.";
        this.addNotification(newDiv, 3000, ComponentNotificationCenter.EventType.success);
    }
};

ComponentTemplateList.TemplateListDivs = {
    title: "title",
    description: "description",
    id_department: "department-and-team",
    route: "route"
};

ComponentTemplateList.EventType = {
    DATA_LOAD: 'template/get-all',
    DATA_SAVE: 'template/update',
    DATA_DELETE: 'template/delete'
};
