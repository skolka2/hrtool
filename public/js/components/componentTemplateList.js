var ComponentTemplateList = function () {
    this.super = ComponentBase;
    this.super.call(this);
    this.data = null;
    this.dropdowns = {};
    this.model = new Model(ComponentTemplateList.EventType.DATA_LOAD);
    this.listen(ComponentTemplateList.EventType.DATA_LOAD, this.model, this.onLoad);
    hrtool.actions.getDefaultTaskData(this.model);
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
    var dropDownData = this.parseToDropdown();
    //Creating header titles and append to the div
    this.createHeader(this.getElement());
    //add eventlistener onClick
    this.getElement().addEventListener(ComponentBase.EventType.CLICK, this.handleOnClick.bind(this));
    //creating tasks
    for (var i = 0; i < this.data.length; i++) {
        var dataMap = this._getSelectedItem(data[i], dropDownData);
        this.addRow(dataMap);
    }
};

ComponentTemplateList.prototype.addRow = function (data) {

    var task = document.createElement("div");
    var id = data.data.id_task_template;
    var divsName = ComponentTemplateList.TemplateListDivs;
    task.className = "row";
    task.setAttribute("data-template-id", id);
    var dropdown = new ComponentFilter(data.dd);
    this.dropdowns[id] = dropdown;
    this.getElement().appendChild(task); //because I need addChild to exist div
    for (var item in divsName) {
        var div = document.createElement("div");
        div.className = divsName[item];
        if (divsName[item] == divsName.id_department) {
            task.appendChild(div);
            this.addChild(divsName[item] + id, dropdown, {id: div});
            dropdown.render(div);
        }
        else if (divsName[item] == divsName.route) {
            //creating save button
            //var el = helper.dom.createElement('<button class="button save">Save</button>');
            var el = document.createElement("button");
            el.className = "button save";
            el.innerHTML = "Save";
            div.appendChild(el);

            //creating delete button
            var el = document.createElement("button");
            el.className = "button delete";
            el.innerHTML = "Delete";
            if (data.data.implicit) {
                //el.disabled = true;//TODO: implement after implementation at server side will be done
            }
            div.appendChild(el);
            task.appendChild(div);
        }
        else {
            var textEl = document.createElement('input');
            textEl.type = "text";
            textEl.className = divsName[item] + " text";
            textEl.value = data.data[item];
            textEl.disabled = true;
            div.appendChild(textEl);
            task.appendChild(div);
        }
    }
    return task;
};

ComponentTemplateList.EventType = {
    DATA_LOAD: 'template/get-all',
    DATA_SAVE: 'template/update',
    DATA_DELETE: 'template/delete'
};

ComponentTemplateList.prototype.createHeader = function (div) {
    var elDivHead = document.createElement("div");
    elDivHead.className = "template-header";
    for (var item in ComponentTemplateList.TemplateListDivs) {
        var elem = document.createElement('div');
        elem.className = "template-header-item";
        elem.innerText = ComponentTemplateList.TemplateListDivs[item];
        elDivHead.appendChild(elem);
        div.appendChild(elDivHead);
    }
};

ComponentTemplateList.prototype.parseToDropdown = function () {
//Departments dropdown:
    var departments = this.helper.bulk.getData(['departments']);
    var departmentsData = {};
    departmentsData[''] = [];
    var item = {};
    for (var i in departments) {
        var item = {
            value: departments[i].title,
            id: departments[i].id_department
        };
        departmentsData[''].push(item);
    }
//Teams dropdown:
    var teams = this.helper.bulk.getData(['teams']);
    var map = this.helper.bulk.getData(['map']);
    var teamsData = {};
    teamsData["global"] = [];
    for (var i in map) {
        for (var j = 0; j < map[i].length; j++) {     //for all teams in department with id === i
            item = {
                value: teams[map[i][j]].title,
                id: teams[map[i][j]].id_team
            };
            teamsData[i] = teamsData[i] || [];
            teamsData[i].push(item);
            teamsData["global"].push(item)
        }
    }
//Tasks dropdown:
    return [departmentsData, teamsData];
};

ComponentTemplateList.prototype._getSelectedItem = function (data, dropDownData) {
    var map = {
        data: data,
        dd: JSON.parse(JSON.stringify(dropDownData)) //create copy of dropdown data, because multiple select....
    };
    if (data.id_department != null) {
        map.dd[0][""][this._getIdForSelected(map.dd[0][""], data.id_department)]['selected'] = "true";
    }
    if ((data.id_team != null) && (data.id_department == null)) {
        map.dd[1]["global"][this._getIdForSelected(map.dd[1]["global"], data.id_team)]['selected'] = "true";
    }
    else if (data.id_team != null) {
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
    if (rowEl = this.getParentByClass(ev.target, "row")) {
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
            rowEl.getElementsByClassName("save").item().innerHTML = "Save";
        }
    }
};

ComponentTemplateList.prototype.handleEditText = function (data) {
    data.object.disabled = false;
    data.rowEl.getElementsByClassName("save").item().innerHTML = "Save";
};

ComponentTemplateList.prototype.handleButtonSave = function (data) {
    data.object.innerHTML = "Saving";
    var titleEl = data.rowEl.getElementsByClassName(ComponentTemplateList.TemplateListDivs.title + " text").item();
    var descEl = data.rowEl.getElementsByClassName(ComponentTemplateList.TemplateListDivs.description + " text").item();
    titleEl.disabled = true;
    descEl.disabled = true;
    var dep = this.dropdowns[data.id].getStatus()[0].id;
    var team = this.dropdowns[data.id].getStatus()[1].id;
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
    this.saveModel = new Model(ComponentTemplateList.EventType.DATA_SAVE);
    this.listen(ComponentTemplateList.EventType.DATA_SAVE, this.saveModel, this.onSave.bind(this, data.object));
    hrtool.actions.saveDefaultTaskData(this.saveModel, saveData);
};

ComponentTemplateList.prototype.handleButtonDelete = function (data) {
    this.deleteModel = new Model(ComponentTemplateList.EventType.DATA_DELETE);
    data.object.disabled = true;
    this.listen(ComponentTemplateList.EventType.DATA_DELETE, this.deleteModel, this.onDelete.bind(this, data.object));
    hrtool.actions.deleteDefaultTaskData(this.deleteModel, {id_task_template: parseInt(data.id)});
};

ComponentTemplateList.prototype.onSave = function (objEl, data) {
    if (data.error) {
        objEl.disabled = false;
    }
    else {
        objEl.innerHTML = "Saved";
    }
};

ComponentTemplateList.prototype.onDelete = function (objEl, data) { //TODO: better way to remove liseners.
    if (data.error) {
        objEl.disabled = false;
    }
    else {
        document.body.removeEventListener(ComponentBase.EventType.CLICK, this.onDelete, false);
        this.dropdowns[data[0].id_task_template].destroy();
        var rowEl = this.getParentByClass(objEl, "row");
        rowEl.innerHTML = "";
    }
};

ComponentTemplateList.prototype.getParentByClass = function (el, className) {
    while (el && el.className !== className) {
        el = el.parentNode;
    }
    return el;
};

ComponentTemplateList.TemplateListDivs = {
    title: "title",
    description: "description",
    id_department: "department-and-team",
    route: "route"
};