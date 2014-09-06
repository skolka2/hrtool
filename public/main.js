/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(14);
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);
	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(17);
	__webpack_require__(18);
	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(21);
	__webpack_require__(22);
	__webpack_require__(23);
	__webpack_require__(2);
	__webpack_require__(24);
	__webpack_require__(25);
	__webpack_require__(26);
	__webpack_require__(27);
	__webpack_require__(28);
	__webpack_require__(29);
	__webpack_require__(30);
	__webpack_require__(31);
	__webpack_require__(32);
	__webpack_require__(33);
	__webpack_require__(34);
	__webpack_require__(35);
	__webpack_require__(36);
	module.exports = __webpack_require__(37);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var app= {};
	 module.exports = app;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);
	var Router = __webpack_require__(29);
	var router;

	(function(){



		$.get("/handshake", function (data) {
			if (!data.error) {
				app.bulk = data.data;
				router = new Router();
				router.init();

			}
		});


		if ("onhashchange" in window) { // event supported?
			window.onhashchange = function () {
				router.changeView(window.location.hash);
			}
		}
		else { // event not supported:
			var storedHash = window.location.hash;
			window.setInterval(function () {
				if (window.location.hash != storedHash) {
					router.changeView(window.location.hash);
				}
			}, 100);
		}


	})(); 


	/*for testing user tasks list  
	var socket = io.connect();

	socket.emit('tasks/user/list', function (data) {
		window.console.log(data.data)});*/


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var EventEmitter =__webpack_require__(27);
	var helper = __webpack_require__(23);


	//Default constructor
	var ComponentBase = module.exports = function(){
		EventEmitter.apply(this);
		this.super = EventEmitter;
		this.childs = {};
		this.element = null;
		this.rendered = false;

		this.helper = helper;
	};

	ComponentBase.prototype = new EventEmitter();
	ComponentBase.prototype.constructor = ComponentBase;

	/**
	 * Insert child element
	 * @param name - name of child (key in object of childes)
	 * @param component - child component
	 * @param wraper - object in format {el: parentElement} or {id: id} or {class: className}
	 */
	ComponentBase.prototype.addChild = function (name, component, wraper){
		if(this.childs[name]){
			console.log("Component with name: " + name + " already exists.");
		}
		else{
			this.childs[name] = {
				'component': component,
				'wrapper': wraper
			};
			this.setAsChild(this.childs[name].component);
		}
	};

	//Remove child component
	ComponentBase.prototype.removeChild = function (name){
		if(this.childs[name]){
			delete this.childs[name];
		}
		else {
			console.log("Component with name: " + name + " is not parrent of this component.");
		}
	};

	ComponentBase.prototype.removeFromDOM = function (){
		//check if its rendered
		if(this.rendered){
			this.element.remove();
			for(var child in this.childs){
				this.childs[child].component.removeFromDOM();
			}
			
			this.rendered = false;
		}
		
	};

	//Delete elements of component including listeners
	ComponentBase.prototype.destroy = function (){
		//check if its rendered
		this.removeFromDOM();
		this.removeListeners(this.componentId);
		for(var name in this.childs){
			
			this.childs[name].component.destroy();
			delete this.childs[name];
			
		}
		
	};

	// Prepare element
	ComponentBase.prototype.createDom = function (){
		this.element = document.createElement("div");
	};

	// Returns element
	ComponentBase.prototype.getElement = function (){
		if(this.element == null){
			this.createDom();
		}
		return this.element;
	};

	// Renders and insert component into dom (including child)
	ComponentBase.prototype.render = function (parrent){

	    var element = this.getElement();
	    parrent = this.getWrapper(parrent);
	    parrent.appendChild(element);

	    this.rendered = true;

	    var child , parrentOfChild;
	    for(var name in this.childs){
	        parrentOfChild = element;
	        child = this.childs[name];
	        if(child.wrapper){
	            if(child.wrapper['el']){
	                parrentOfChild = this.helper.obj.getData(child.wrapper, ['el']);
	            }
	            else if(child.wrapper['id']){
	                parrentOfChild = document.getElementById(this.helper.obj.getData(child.wrapper, ['id']));
	            }
	            else if(child.wrapper['class']){
	                parrentOfChild = document.getElementsByClassName(this.helper.obj.getData(child.wrapper, ['class']))[0];
	            }
	        }
	        child.component.render(parrentOfChild);

	    }
	};

	ComponentBase.prototype.addNotification = function(contentEl, duration, type) {

	};

	//Check if wrapper exists. If wrapper doesnt exists create general wrapper
	ComponentBase.prototype.getWrapper = function(wrapper){
	    if(wrapper == null){
	        return document.getElementById(ComponentBase.mainWrapper);
	    }
	    return wrapper;
	};

	ComponentBase.prototype.setModel = function(model, eventType) {
		this.model = model;
		this.listen(eventType, model, this.onLoad);
	};

	ComponentBase.prototype.onLoad = function(data) {

	};

	ComponentBase.mainWrapper = "main-wrapper";
	ComponentBase.EventType = {
		CLICK: "click",
		CHANGE: "change",
	    ONKEYPRESS: "keypress",
	    BLUR: "blur",
	    DOMContentLoaded: "DOMContentLoaded"
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);
	var ComponentUserTaskDetail = __webpack_require__(16);
	var Model = __webpack_require__(26);
	var hrtool = __webpack_require__(24);

	var ComponentListVladLaz = module.exports = function() {
		ComponentBase.call(this);
		this.super = ComponentBase;
		this.data = null;
		this.model = new Model (ComponentListVladLaz.EventType.DATA_LOAD);
		this.listen(ComponentListVladLaz.EventType.DATA_LOAD, this.model, this.onLoad);
		hrtool.actions.getUserTaskData(this.model);
	}

	ComponentListVladLaz.prototype = new ComponentBase();
	ComponentListVladLaz.prototype.constructor = ComponentListVladLaz;

	ComponentListVladLaz.prototype.onLoad = function(data) {
		this.data = data;

		for(var i = 0; i < this.data.length; i++) {
			var taskData = this.data[i];

			var taskDataModified = {
				taskId: taskData.id_task,
				taskBuddy: taskData.email,
				taskTitle: taskData.title,
				dateFrom: taskData.date_from,
				dateTo: taskData.date_to,
				taskDescription: taskData.description,
				taskNotes: taskData.notes,
				isFinished: taskData.completed
			};
			
			var task = new ComponentUserTaskDetail(taskDataModified);
			this.addChild("userTask"+i, task, this.getElement());

			if(this.rendered) {
				this.getElement().appendChild(task.getElement());
			}
		}
	}

	ComponentListVladLaz.prototype.createDom = function() {
		var wrapper = document.createElement('div');
		wrapper.className = "vladlaz-task-list";
		this.element = wrapper;
	}

	ComponentListVladLaz.EventType = {DATA_LOAD: 'tasks/user/list'};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);
	var app = __webpack_require__(1);

	var ComponentNavBar =  module.exports =  function () {
	    this.super.call(this);
	    this.super = ComponentBase;
	    this.data = {
	        hrBuddy: '<a href="mailto:'  + this.helper.bulk.getData(['hrBuddy', 'email']) + '">' + this.helper.bulk.getData(['hrBuddy', 'first_name']) + " " + this.helper.bulk.getData(['hrBuddy', 'last_name']) + '</a>',
	        user: '<a href="' + ComponentNavBar.USER_PAGE + this.helper.bulk.getData(['user', 'id_user']) + '">' + this.helper.bulk.getData(['user', 'first_name']) + " " + this.helper.bulk.getData(['user', 'last_name']) + '</a>'
	    };
	};

	ComponentNavBar.prototype = new ComponentBase();
	ComponentNavBar.prototype.constructor = ComponentNavBar;

	ComponentNavBar.prototype.createDom = function () {
	    var div = document.getElementById(ComponentNavBar.ID);
	    if(app && app.bulk){
	        var div2 = document.createElement("div");
	        div2.id = ComponentNavBar.USER_DIV_ID;
	        //create ahref buddy
	        var elem = this.helper.dom.createElement(this.data.hrBuddy);
	        div.appendChild(elem);
	        div.appendChild(this.createMenu());
	        //create ahref Login name
	        elem = this.helper.dom.createElement(this.data.user);
	        div2.appendChild(elem);
	        //create logout button
	        elem = this.helper.dom.createElement('<a href="' + ComponentNavBar.LOGOUT_PAGE + '">Logout</a>');
	        div2.appendChild(elem);
	        div.appendChild(div2);
	    }else{
	        var elem = this.helper.dom.createElement('<a href="' + ComponentNavBar.LOGIN_PAGE + '">Login</a>');
	        div.appendChild(elem);
	    }
	    this.element = div;
	};


	ComponentNavBar.prototype.createMenu = function(){
	    var menu = document.createElement('div');
	    menu.id = ComponentNavBar.MENU_CLASS;
	    if(this.helper.bulk.getData(['user', 'id_user_role']) === ComponentNavBar.TEAM_MANAGER || this.helper.bulk.getData(['user', 'id_user_role']) === ComponentNavBar.ADMIN){
	        var homeEl = this.helper.dom.createElement('<a href="#"><div class=' + ComponentNavBar.MENU_ITEM_CLASS + '>Home</div></a>');
	        menu.appendChild(homeEl);
	        var tasksEl = this.helper.dom.createElement('<a href="#taskAdmin"><div class=' + ComponentNavBar.MENU_ITEM_CLASS + '>Tasks</div></a>');
	        menu.appendChild(tasksEl);
	        var peopleEl = this.helper.dom.createElement('<a href="#poopleAdmin"><div class=' + ComponentNavBar.MENU_ITEM_CLASS + '>People</div></a>');
	        menu.appendChild(peopleEl);
	        if(this.helper.bulk.getData(['user', 'id_user_role']) === ComponentNavBar.ADMIN){
	            var depEl = this.helper.dom.createElement('<a href="#departmentAdmin"><div class=' + ComponentNavBar.MENU_ITEM_CLASS + '>Departments</div></a>');
	            menu.appendChild(depEl);
	        }
	    }else{
	        var tasksEl = this.helper.dom.createElement('<a href="#taskAdmin"><div class=' + ComponentNavBar.MENU_ITEM_CLASS + '>Tasks</div></a>');
	        menu.appendChild(tasksEl);
	    }

	    return menu;
	};


	ComponentNavBar.prototype.render = function(){
	    if(!this.rendered)
	        document.getElementById('navbar').innerHTML = '<a href="/auth/google" id="login-button">Login</a>';
	    document.getElementById('login-button').style.display = 'none';
	    this.rendered = true;
	    this.createDom();
	};



	ComponentNavBar.USER_PAGE = "/User/user=";
	ComponentNavBar.LOGOUT_PAGE = "/logout";
	ComponentNavBar.LOGIN_PAGE = "/login";
	ComponentNavBar.ID = "navbar";
	ComponentNavBar.ADMIN = 3;
	ComponentNavBar.TEAM_MANAGER = 2;
	ComponentNavBar.USER_DIV_ID = 'navbar-user';
	ComponentNavBar.MENU_ITEM_CLASS = 'navbar-menu-item';
	ComponentNavBar.MENU_CLASS = 'navbar-menu';


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);
	var Model = __webpack_require__(26);
	var ComponentFilter = __webpack_require__(11);
	var hrtool = __webpack_require__(24);
	var helper = __webpack_require__(23);
	var ComponentFilterFormatter = __webpack_require__(12);

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
	        var dep = dropStatus[0].id;
	        var team = dropStatus[1].id;
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
	        helper.dom.getParentByClass(objEl,"implicit-task").innerHTML = "Implicit task has been successful saved.";
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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);
	var Model = __webpack_require__(26);
	var ComponentFilter = __webpack_require__(11);
	var hrtool = __webpack_require__(24);
	var helper = __webpack_require__(23);

	var ComponentTemplateList =  module.exports  = function () {
	    this.super = ComponentBase;
	    this.super.call(this);
	    this.data = null;
	    this.dropdowns = {};
	    this.setModel(new Model(ComponentTemplateList.EventType.DATA_LOAD),ComponentTemplateList.EventType.DATA_LOAD);
	    hrtool.actions.getTemplatesData(this.model);
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

	    var div = document.createElement("div");
	    var el = document.createElement('input');

	    //create title input
	    div.className = divsName.title;
	    el.type = "text";
	    el.className = divsName.title + " text";
	    el.value = data.data[divsName.title ];
	    el.disabled = true;
	    div.appendChild(el);
	    task.appendChild(div);

	    //create description input
	    div = document.createElement("div");
	    el = document.createElement('input');
	    div.className = divsName.description;
	    el.type = "text";
	    el.className = divsName.description + " text";
	    el.value = data.data[divsName.description ];
	    el.disabled = true;
	    div.appendChild(el);
	    task.appendChild(div);

	    //create department and team
	    div = document.createElement("div");
	    div.className = divsName.id_department;
	    task.appendChild(div);
	    this.addChild(divsName.id_department + dropdown.componentId, dropdown, {el: div});
	    dropdown.render(div);

	    //create save button
	    div = document.createElement("div");
	    el = document.createElement("button");
	    div.className = divsName.route;
	    el.className = "button save";
	    el.innerHTML = "Save";
	    div.appendChild(el);

	    //create delete button
	    el = document.createElement("button");
	    el.className = "button delete";
	    el.innerHTML = "Delete";
	    if (data.data.implicit) {
	        //el.disabled = true;//TODO: implement after implementation at server side will be done
	    }
	    div.appendChild(el);
	    task.appendChild(div);

	    return task;
	};

	ComponentTemplateList.prototype.createHeader = function (div) {
	    var elDivHead = document.createElement("div");
	    elDivHead.className = "template-header";
	    for (var item in ComponentTemplateList.TemplateListDivs) {
	        var elem = document.createElement('div');
	        elem.className = "template-header-item";
	        elem.innerText = ComponentTemplateList.TemplateListDivs[item];
	        if(ComponentTemplateList.TemplateListDivs.id_department == item){
	            elem.innerText = ComponentTemplateList.TemplateListDivs[item];
	        }
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
	    //teamsData["global"] = [];
	    for (var i in map) {
	        for (var j = 0; j < map[i].length; j++) {     //for all teams in department with id === i
	            item = {
	                value: teams[map[i][j]].title,
	                id: teams[map[i][j]].id_team
	            };
	            teamsData[i] = teamsData[i] || [];
	            teamsData[i].push(item);
	            //teamsData["global"].push(item)
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
	    var dropdownStatus = this.dropdowns[data.id].getStatus();
	    titleEl.disabled = true;
	    descEl.disabled = true;
	    var dep = dropdownStatus[0].id;
	    var team = dropdownStatus[1].id;
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
	};

	ComponentTemplateList.prototype.handleButtonDelete = function (data) {
	    var deleteModel = new Model(ComponentTemplateList.EventType.DATA_DELETE);
	    data.object.disabled = true;
	    this.listen(ComponentTemplateList.EventType.DATA_DELETE, deleteModel, this.onDelete.bind(this, data.object));
	    hrtool.actions.deleteDefaultTaskData(deleteModel, {id_task_template: parseInt(data.id)});
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
	        var rowEl = helper.dom.getParentByClass(objEl, "row");
	        rowEl.innerHTML = "";
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);
	var Model = __webpack_require__(26);

	var ComponentTest =  module.exports = function () {
	    this.super = ComponentBase;
	    this.super.call(this);
	    this.model = new Model(ComponentTest.EventType.DATA_LOAD);
	    //listen on data loda
	    this.listen(ComponentTest.EventType.DATA_LOAD, this.model, this.onLoad);
	    //load data
	    hrtool.actions.getTestData(this.model);
	}
	ComponentTest.prototype = new ComponentBase();
	ComponentTest.prototype.constructor = ComponentTest;

	ComponentTest.prototype.createDom = function(){
	    var el = document.createElement('div');
	    el.className = 'test-element-wrapper';
	    this.element = el;
	}

	ComponentTest.prototype.onLoad = function(data){
	    wrapper = this.getElement();
	    var span;
	    for(var name in data) {
	        span = document.createElement('span');
	        span.innerHTML = '<strong>' + name + '</strong> has car: ' + data[name].car + '<br>';
	        wrapper.appendChild(span);
	    }
	}

	ComponentTest.EventType = {
	    DATA_LOAD: 'test-data-load'
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);

	var ComponentCheckBox = module.exports =  function(labelText,checked){
		ComponentBase.apply(this);
		this.super = ComponentBase;
		this.labelText =  "";
		

		if(!!labelText){
			this.labelText = labelText;
		}
		this.checked = !!checked;
	}

	ComponentCheckBox.prototype = new ComponentBase();
	ComponentCheckBox.prototype.constructor = ComponentCheckBox;

	ComponentCheckBox.prototype.createDom = function(){
		var buddyCheckbox = document.createElement("div");	
		buddyCheckbox.className =  "buddy-checkbox";
		buddyCheckbox.id = "buddy-checkbox" + this.componentId;

		this.checkChecked = document.createElement("div");
		
		this._setCheckClass();

		this.label = document.createElement("div");
		this.label.className = "checkbox-label";

		this.label.innerText = this.labelText;

		buddyCheckbox.appendChild(this.checkChecked);
		buddyCheckbox.appendChild(this.label);

		this.element = buddyCheckbox;

		this.element.addEventListener(ComponentBase.EventType.CLICK ,this.handleOnClick.bind(this),false);
		/*<div class=buddy-checkbox1>
			<div class=check.Checked/>
			</div>
			<div class="label">checkbox label
			</div>
		</div>*/
	}

	ComponentCheckBox.prototype._setCheckClass = function(){
		if(this.checked){
			this.checkChecked.className = ComponentCheckBox.checkBoxClass.CHECKED;	
		}
		else{
			this.checkChecked.className = ComponentCheckBox.checkBoxClass.NOTCHECKED;
		}
	}

	//Tells what happens when we click on CheckBox
	ComponentCheckBox.prototype.handleOnClick = function(){
		this.setChecked(!this.checked);

	}

	// Sets CheckBox tittle
	ComponentCheckBox.prototype.setCheckBoxTittle = function(tittle){
		this.labelText = tittle;
		this.label.innerText = tittle;
	}

	// Changes CheckBox 
	ComponentCheckBox.prototype.setChecked = function(checked){
		this.getElement();
		this.checked = checked;
		this._setCheckClass();
		this.fire(ComponentBase.EventType.CHANGE,this.checked);
	}

	ComponentCheckBox.checkBoxClass = {
		CHECKED:"checkbox checked",
		NOTCHECKED:"checkbox"
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);
	/**
	 * DropDown class: creates clickable span contaning selected item and
	 * a list (ul - with visibility set on 'hidden' by default) of selectable items.
	 * The list is shown when the span is clicked. After that it can be hidden by
	 * clicking on an item of the list (this item is accessible in this.selected
	 * now) or by clicking anywhere else in the body (this.selected remains
	 * unchanged).
	 * @param {object} data
	 * @returns {ComponentDropdown}
	 */
	var ComponentDropdown = module.exports = function(data) {
	    ComponentBase.prototype.constructor.call(this);
	    this.super = ComponentBase;
	    this.selected = "";
	    this._enabled = true;

	    this._map = [];

	    this._selectedTextElement = document.createElement('div');
	    this._selectedTextElement.className = 'dropdown-button ' + ComponentDropdown.State.ENABLED;

	    this._listEl = document.createElement('ul');
	    this._listEl.className = 'dropDownButton';
	    this._listEl.style.visibility = 'hidden';

	    this._selectedTextElement.addEventListener(ComponentBase.EventType.CLICK, this._handleListOpen.bind(this), false);
	    this.changeData(data);
	};


	ComponentDropdown.prototype = new ComponentBase();
	ComponentDropdown.prototype.constructor = ComponentDropdown;

	ComponentDropdown.EventType = {
	    CHANGE: 'change'
	};

	ComponentDropdown.State = {
	    ENABLED: 'dropdown',
	    DISABLED: 'dropdown disabled'
	};

	/**
	 * Shows the list of items provided in data object
	 * @returns {undefined}
	 */
	ComponentDropdown.prototype._handleListOpen = function () {
	    if(this._enabled) {
	        if (this._listEl.style.visibility === 'visible') {
	            this._listEl.style.visibility = 'hidden';
	            return;
	        }

	        /*Close list on click in body (outside of span)*/
	        this._listEl.style.visibility = 'visible';
	        var onClick;
	        onClick = function (ev) {
	            if (this.getElement() === ev.target || this.getElement().contains(ev.target)) {
	                this._makeSelection(ev, onClick);
	            }
	            else {
	                this._listEl.style.visibility = 'hidden';
	                document.body.removeEventListener(ComponentBase.EventType.CLICK, onClick, false);
	            }
	        }.bind(this);

	        document.body.addEventListener(ComponentBase.EventType.CLICK, onClick, false);
	    }
	};

	/**
	 *
	 * @param {object} data Object containing data with keys 'selected' and 'items',
	 * where items is an object or array with items to be shown as options.
	 * @returns {undefined}
	 */
	ComponentDropdown.prototype._fillWithData = function(data) {
	    this._map = [];

	    if(data === ComponentDropdown.EmptyOption)
	        this.setEnabled(false);
	    var li = document.createElement('li');
	    li.className = 'dropDownItem deselector';
	    li.innerHTML = "Clear...";
	    var empty = ComponentDropdown.EmptyOption;
	    this._map.push({
	        el: li,
	        value: empty
	    });

	    var text = document.createTextNode("");
	    li.appendChild(text);

	    this._listEl.appendChild(li);
	    this.setSelection(empty);

	    for(var i = 0; i < data.length; i++) {
	        var li = document.createElement('li');
	        li.className = 'dropDownItem';
	        this._map.push({
	            el: li,
	            value: data[i]
	        });

	        var text = document.createTextNode(data[i].value);
	        li.appendChild(text);

	        this._listEl.appendChild(li);

	        if(data[i].selected) {
	            this.setSelection(data[i]);
	        }
	    }
	};

	/**
	 * Sets new label and saves selected item into this.selected
	 */
	ComponentDropdown.prototype.setSelection = function(selectedItem) {
	    this.selected = selectedItem;
	    if(selectedItem.value === "") {
	        this._selectedTextElement.innerHTML = "Select...";
	    }
	    else {
	        this._selectedTextElement.innerHTML = selectedItem.value;
	    }
	};

	/**
	 * Verifies correct form of data object and if it's OK, calls the function
	 * filling list with data.
	 * @param {object} data Object containing data with keys 'selected' and 'items',
	 * where items is an object or array with items to be shown as options.
	 * @returns {undefined}
	 */
	ComponentDropdown.prototype.changeData = function (data) {
	    this._listEl.innerHTML = "";
	    this._fillWithData(data);
	};
	/**
	 * When an option is clicked, this function changes selected item
	 * @param {element} src source of event ComponentBase.EventType.CLICK
	 * @param {function} onClick function to remove from eventListener binded on body
	 * @returns {undefined}
	 */
	ComponentDropdown.prototype._makeSelection = function (src, onClick) {
	    var selection = this._map.filter(function(item){
	            return item.el === src.target}
	    );

	    if(selection.length > 0) {
	        this.setSelection(selection[0].value);

	        this._listEl.style.visibility = 'hidden';
	        document.body.removeEventListener(ComponentBase.EventType.CLICK, onClick, false);
	        this.fire(ComponentDropdown.EventType.CHANGE, this.selected);
	    }
	};

	/**
	 * Creates component's DOM. Inserts html elements into one <div>
	 * @returns {undefined}
	 */
	ComponentDropdown.prototype.createDom = function() {
	    this.element = document.createElement("div");
	    this.element.className = 'dropDownDiv';

	    this.element.appendChild(this._selectedTextElement);
	    this.element.appendChild(this._listEl);
	};

	/**
	 * Sets dropdown's property enabled (it is clickable if true)
	 * @param enabled true/false - enabled/disabled
	 */
	ComponentDropdown.prototype.setEnabled = function(enabled) {
	    this._enabled = enabled;
	    var selection = this._selectedTextElement.classList;
	    if (enabled) {
	        selection.remove("disabled");
	    }
	    else {
	        selection.add("disabled");
	    }
	};
	/**
	 * Returns true if enabled, false otherwise
	 * @returns {boolean|*}
	 */
	ComponentDropdown.prototype.getIsEnabled = function() {
	    return this._enabled;
	};

	ComponentDropdown.EmptyOption = {
	    value: "",
	    id: -1
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);
	var ComponentDropdown = __webpack_require__(10);
	var helper = __webpack_require__(23);

	var ComponentFilter  =  module.exports =  function(data, keys) {
	    ComponentBase.prototype.constructor.call(this);
	    this.super = ComponentBase;

	    this._keys = keys;
	    this._status = [];
	    this._data = data;
	    this._dropdowns = [];
	    var initData;
	    var newDropdown;
	    for(var i = 0; i < data.length; i++) {
	        initData = this._initData(i);
	        newDropdown = new ComponentDropdown(initData);

	        this._dropdowns.push(newDropdown);
	        this._status.push(newDropdown.selected);

	        this.listen(ComponentDropdown.EventType.CHANGE, newDropdown, this._filterData);
	    }
	};

	ComponentFilter.prototype = new ComponentBase();
	ComponentFilter.constructor = ComponentFilter;

	ComponentFilter.prototype._initData = function(i) {
	    var data = this._data[i];
	    var selection = this._getSelection(i);

	    if(data[selection]) {
	        return data[selection];
	    }

	    var keys = Object.keys(data);
	    var key = keys.length > 0 ? keys[0] : '';

	    var keyLength = key.split('-').length;
	    keyLength = keyLength === 1 && key.length === 0 ? 0 : keyLength;
	    var global = '';

	    for(var i = 0; i < keyLength; i++) {
	        global += 'global-';
	    }

	    if(global.length > 0)
	        global = global.substring(0, global.length - 1);

	    var items = data[global] || ComponentDropdown.EmptyOption;
	    return items;
	};

	ComponentFilter.prototype.getStatus = function () {
	    if(!this._keys)
	        return this._status;
	    var res = {};
	    for(var i = 0; i < this._keys.length; i++){
	        res[this._keys[i]] = this._status[i];
	    }
	    return res;
	};

	ComponentFilter.prototype._filterData = function(selected, src) {
	    for(var i = 0; i < this._dropdowns.length; i++) {
	        var dropdown = this._dropdowns[i];
	        var data;
	        var selection;
	        if(src < dropdown.componentId ) {
	            selection = this._getSelection(i);
	            data  = this._data[i][selection];
	            data = data ? data : ComponentDropdown.EmptyOption;
	            dropdown.changeData(data);
	            dropdown.setSelection(ComponentDropdown.EmptyOption);
	            this._status[i] = dropdown.selected;
	            dropdown.setEnabled(data !== ComponentDropdown.EmptyOption);
	        } else if(src === dropdown.componentId) {
	            this._status[i] = selected;
	        }
	    }
	    this.fire(ComponentFilter.EventType.UPDATED, this.getStatus());
	};

	ComponentFilter.prototype._getSelection = function(depth) {
	    var selection = '';
	    var randomKey = Object.keys(this._data[depth])[0];
	    var length = randomKey === '' ? 0 : randomKey.split("-").length;
	    var oneSelected;
	    for(var i = 0; i < length; i++) {
	        oneSelected = helper.obj.getData(this._dropdowns[i], ['selected', 'id']);
	        selection += oneSelected === -1 ? 'global' : oneSelected;
	        selection += '-';
	    }

	    if(selection.length > 0)
	        selection = selection.substring(0, selection.length - 1);

	    return selection;
	};

	ComponentFilter.prototype.createDom = function() {
	    var mainDiv = document.createElement('div');
	    mainDiv.class = "filtrable-task";

	    for(var i = 0; i < this._dropdowns.length; i++) {
	        this.addChild('dropdown' + this._dropdowns[i].componentId, this._dropdowns[i], {'el': mainDiv});
	    }

	    this.element = mainDiv;
	};

	ComponentFilter.prototype.unselectAll = function() {
	    var firstDropdown = this._dropdowns[0];
	    firstDropdown.setSelection(ComponentDropdown.EmptyOption);
	    this._filterData(ComponentDropdown.EmptyOption, firstDropdown.componentId);
	};

	ComponentFilter.EventType = {
	    UPDATED: 'new_selection'
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentFilterFormatter = {
	    /**
	     * Function will transform general object to object for dropdown
	     * @param data - object of objects to transform
	     * @param idKey - key in general object which value will be used as value of key id in result object
	     * @param valueKey - key in general object which value will be used as value of key value in result object
	     * @param [dependencyKeys] - array of dependency keys for each dropdown
	     * @returns {{}} - object for dropdown
	     */
	    transform: function (data, idKey, valueKey, dependencyKeys) {
	        var id = '';
	        var res = {};
	        for (var i in data) {
	            var item = {};
	            item = {
	                id: data[i][idKey],
	                value: data[i][valueKey]
	            };
	            if (dependencyKeys) {
	                for (var j = 0; j < dependencyKeys.length; j++) {
	                    id += data[i][dependencyKeys[j]] || 'global';
	                    if (j !== dependencyKeys.length - 1) id += '-';
	                }
	            }
	            res[id] = res[id] || [];
	            res[id].push(item);
	            id = '';
	        }
	        return res;
	    },
	    /**
	     * Function will delete items in dropdowns for which there is no items in last dropdowns
	     * @param data - array of objects for dropdowns
	     * @returns {*} - data object for componentFilter
	     */
	    format: function (data) {
	        var allowedIds = new Array(data.length);
	        for(var i = 0; i < allowedIds.length; i++){
	            allowedIds[i] = {};
	        }

	        for (var i = data.length - 1; i >= 0; i--){
	            if (i !== data.length - 1) {
	                for (var j in data[i]) {
	                    var dropItems = data[i][j];
	                    for (var k = dropItems.length - 1; k >= 0; k--) {
	                        if (!allowedIds[i][dropItems[k].id]) {
	                            dropItems.splice(k, 1);
	                        }
	                    }
	                    if (dropItems.length === 0) {
	                        delete data[i][j];
	                    }
	                }
	            }
	            var keys = Object.keys(data[i]);
	            for (var j = 0; j < keys.length; j++) {
	                var keyArr = keys[j].split('-');
	                var added = false;
	                var k;
	                for(k = 0; k < keyArr.length; k++){
	                    if (keyArr[k] === 'global' && k - 1 >= 0) {
	                        allowedIds[k - 1][keyArr[k - 1]] = true;
	                        added = true;
	                        break;
	                    }
	                }
	                if(!added) allowedIds[k - 1][keyArr[k - 1]] = true;
	            }
	        }
	        return data;
	    },
	    factory : {
	        createTemplateDropdowns : function(departments, teams, templates){
	            var res = ComponentFilterFormatter.format([
	                ComponentFilterFormatter.transform(departments, 'id_department', 'title'),
	                ComponentFilterFormatter.transform(teams, 'id_team', 'title', ['id_department']),
	                ComponentFilterFormatter.transform(templates, 'id_task_template', 'title', ['id_department', 'id_team'])
	            ]);
	            return res;
	        },
	        createTeamDropdowns : function(departments, teams){
	            var res = ComponentFilterFormatter.format([
	                ComponentFilterFormatter.transform(departments, 'id_department', 'title'),
	                ComponentFilterFormatter.transform(teams, 'id_team', 'title', ['id_department'])
	            ]);
	            return res;
	        }
	    }
	};

	module.exports = ComponentFilterFormatter;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);

	var ComponentHide  = module.exports = function(header,content, closed){
	    ComponentBase.call(this);
	    this.super = ComponentBase;


	    // Header element
	    this.headlineEl  = header;
	    // Is it closed?
	    this.closed = !!closed;
	    this.headTittle= this.arrow = null;
	   	this.contentEl = content;
	}

	ComponentHide.prototype = new ComponentBase();
	ComponentHide.prototype.constructor = ComponentHide;

	// Creates Dom
	ComponentHide.prototype.createDom = function(){
		var wrapper = document.createElement("div");
		wrapper.className = "hide-comp";

		var head =  document.createElement("div");
		head.className = "hide-head";


		this.headTittle = document.createElement("div");
		this.headTittle.className = "hide-tittle";

		this.setHeader(this.headlineEl );

		this.arrow = document.createElement("div");
		this.arrow.className = "hide-arrow";

		this.arrow.addEventListener(ComponentBase.EventType.CLICK,this.handleHide.bind(this),false);

		head.appendChild(this.headTittle);
		head.appendChild(this.arrow);

		this.setContent(this.contentEl);


		wrapper.appendChild(head);
		wrapper.appendChild(this.content);

		this.element = wrapper;

		this.setVisibility(this.closed);
		
	} 

	// Hides or shows childs.
	ComponentHide.prototype.handleHide = function(){
		this.closed = !this.closed;

		this.setVisibility(this.closed);
		if(this.closed){	
			this.fire(ComponentHide.EventType.REMOVE,this.componentId);
		}
		else{
			this.fire(ComponentHide.EventType.RENDER,this.componentId);
		}
	}
	// Changes visibility of content and changes arrow
	ComponentHide.prototype.setVisibility = function(show){
		if(!show){
			this.content.className = "hide-content";
			this.arrow.innerHTML = "<span>HIDE</span><div>" + ComponentHide.Arrows.DOWN + "</div>";
		}
		else {
			this.content.className = "hide-content hidden";
			this.arrow.innerHTML = "<span>SHOW</span><div>" + ComponentHide.Arrows.UP + "</div>";
		}
	}

	// Sets content
	ComponentHide.prototype.setContent = function(content){
		if(this.content == null){
			this.content = document.createElement("div");
			this.content.className = 'hide-content';
		}
		else{
			while(this.content.firstChild){
			    this.content.removeChild(this.content.firstChild);
			}
		}
		this.content.appendChild(content);
	}
	// Sets header of component
	ComponentHide.prototype.setHeader = function(header){
		while(this.headTittle.firstChild){
		    this.headTittle.removeChild(this.headTittle.firstChild);
		}
		this.headTittle.appendChild(header);
	} 
	// Gets wrapper for content
	ComponentHide.prototype.getContentWrapper = function(){
		this.getElement();
		return this.content;
	}


	// Renders component, hides childs if they should be hidden.
	ComponentHide.prototype.render = function(wrapper){
		this.super.prototype.render.call(this,wrapper);
		if(this.closed){
			this.setVisibility(this.closed);
		}
	}
	// Event Types.
	ComponentHide.EventType = 
	{
		REMOVE:"childsRemoved",
		RENDER:"childsRendered"
	}

	ComponentHide.Arrows = {
		UP: "&#8744;",
		DOWN: "&#8743;"
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);
	var ComponentFilterFormatter = __webpack_require__(12);
	var ComponentFilter = __webpack_require__(11);
	var hrtool = __webpack_require__(24);
	var Model = __webpack_require__(26);

	var ComponentTasksTemplate = function() {
	    ComponentBase.prototype.constructor.call(this);
	    this.super = ComponentBase;
	    this._visible = false;
	    this._componentFilter = null;
	    this.setModel(new Model(ComponentTasksTemplate.EventType.GET_DATA), ComponentTasksTemplate.EventType.GET_DATA);
	    hrtool.actions.getTemplatesData(this.model);
	};

	ComponentTasksTemplate.prototype = new ComponentBase();
	ComponentTasksTemplate.constructor = ComponentTasksTemplate;



	ComponentTasksTemplate.prototype.onLoad = function(templates){
	    var departments = this.helper.bulk.getData(['departments']);
	    var teams = this.helper.bulk.getData(['teams']);
	    var data = ComponentFilterFormatter.factory.createTemplateDropdowns(departments, teams, templates);

	    this._componentFilter = new ComponentFilter(data, ['department', 'team', 'template']);
	    this._componentFilter.render(this.element);
	    this.addChild('componentFilter', this._componentFilter, {el: this.element});
	};



	/**
	 * Creates component's DOM. Inserts html elements into one <div>
	 */
	ComponentTasksTemplate.prototype.createDom = function() {
	    this.element = document.createElement('div');
	    this.element.className = ComponentTasksTemplate.DIV_CLASS;

	    var headline = document.createElement('span');
	    headline.className = ComponentTasksTemplate.HEADLINE_CLASS;
	    headline.innerHTML = 'Choose saved task';
	    this.element.appendChild(headline);
	};


	/**
	 * State of component getter
	 * @returns {boolean} - true if component is visible, false otherwise
	 */
	ComponentTasksTemplate.prototype.isVisible = function(){
	    return this._visible;
	};

	/**
	 * Set actual state of this component
	 * @param visible - true/false
	 */
	ComponentTasksTemplate.prototype.setVisible = function(visible){
	    this._visible = visible;
	};

	ComponentTasksTemplate.DIV_CLASS = 'task-template-div';
	ComponentTasksTemplate.HEADLINE_CLASS = 'task-template-headline';
	ComponentTasksTemplate.EventType = {GET_DATA: 'template/get-all'};

	module.exports = ComponentTasksTemplate;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);

	/*
	Object, which contains HTML element for task detail and other properties and functions inherrited from ComponentBase object.
	Also contains variables for storing data about the task. 
	*/
	var ComponentBaseTaskDetail = module.exports = function(taskParams) {
		ComponentBase.call(this);
		this.super = ComponentBase;
		this.taskBuddy = taskParams.taskBuddy; //String
		this.taskTitle = taskParams.taskTitle; //String
		this.dateFrom = new Date(taskParams.dateFrom); //Date
		this.dateTo = new Date(taskParams.dateTo); //Date
		this.taskDescription = taskParams.taskDescription; //String
		this.taskNotes = taskParams.taskNotes; //String
		this.isFinished = taskParams.isFinished; //Boolean
		this.taskWrapper = null;
		this.headerWrapper = null;
		this.buddyLabel = null;
		this.titleLabel = null;
		this.timeLabel = null;
		this.descriptionWrapper = null;
		this.descriptionParagraph = null;
		this.notesWrapper = null;
		this.notesText = null;
		this.footerWrapper = null;
	}

	ComponentBaseTaskDetail.prototype = new ComponentBase();
	ComponentBaseTaskDetail.prototype.constructor = ComponentBaseTaskDetail;

	/*
	Overridden function from component BaseObject - it creates DOM, which will be rendered by other function (render) inherrited from ComponentBase.
	*/
	ComponentBaseTaskDetail.prototype.createDom = function() {

		this.taskWrapper = document.createElement('div');
		this.taskWrapper.className = "task-wrapper";

		if((this.dateTo < new Date()) && (this.isFinished === false)) {
			this.taskWrapper.className = "task-wrapper-overflow";
		}
		else {
			this.taskWrapper.className = "task-wrapper";
		}

		this.headerWrapper = document.createElement('div');
		this.headerWrapper.className = "header-wrapper";

		this.buddyLabel = this.helper.dom.createElement('<span class="buddy-label">'+this.taskBuddy+'</span>');
		this.headerWrapper.appendChild(this.buddyLabel);

		this.titleLabel = this.helper.dom.createElement('<span class="task-label">'+this.taskTitle+'</span>');
		this.headerWrapper.appendChild(this.titleLabel);

		this.timeLabel = this.helper.dom.createElement('<span> Timerange: '+this.helper.format.getDate(this.dateFrom)+' - '+this.helper.format.getDate(this.dateTo)+'</span>');
		this.timeLabel.className = "time-label-overflow";
		this.headerWrapper.appendChild(this.timeLabel);

		this.descriptionWrapper = document.createElement('div');
		this.descriptionWrapper.className = "description-wrapper";

		this.descriptionParagraph = this.helper.dom.createElement('<p class="description-paragraph">Task description: '+this.taskDescription+'</p>');
		this.descriptionWrapper.appendChild(this.descriptionParagraph);

		this.notesWrapper = document.createElement('div');
		this.notesWrapper.className = "notes-wrapper";

		this.notesText = this.helper.dom.createElement('<p class="notes-text"> Task notes: '+this.taskNotes+'</p>');
		this.notesWrapper.appendChild(this.notesText);

		this.footerWrapper = document.createElement('div');
		this.footerWrapper.className = "footer-wrapper";

		this.taskWrapper.appendChild(this.headerWrapper);
		this.taskWrapper.appendChild(this.descriptionWrapper);
		this.taskWrapper.appendChild(this.notesWrapper);
		this.taskWrapper.appendChild(this.footerWrapper);

		this.element = this.taskWrapper; //saving all DOM elements in the element of this object
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);
	var ComponentBaseTaskDetail = __webpack_require__(15);
	var Model = __webpack_require__(26);
	var hrtool = __webpack_require__(24);

	/*
	Object, which contains HTML element for user task detail and other properties and functions inherrited from ComponentTaskDetail object.
	Also has variables for storing certain HTML elements that are used in functions of the object. 
	*/
	var ComponentUserTaskDetail = module.exports = function(taskParams) {
		ComponentBaseTaskDetail.call(this, taskParams);
		this.super = ComponentBaseTaskDetail;
		this.taskId = taskParams.taskId;
		this.textArea = null;
		this.saveNotesBttn = null;
		this.finishTaskBttn = null;
		this.finishTaskBttnNo = null;
		this.finishTaskBttnYes = null;
		this.notifications = null;
	}

	ComponentUserTaskDetail.prototype = Object.create(ComponentBaseTaskDetail.prototype);
	ComponentUserTaskDetail.prototype.constructor = ComponentUserTaskDetail;

	/*
	Overridden function from component BaseObject - it creates DOM, which will be rendered by other function (render) inherrited from ComponentBase.
	*/
	ComponentUserTaskDetail.prototype.createDom = function() {
		this.super.prototype.createDom.apply(this);

		this.headerWrapper.removeChild(this.buddyLabel);
		this.notesWrapper.removeChild(this.notesText);

		this.textArea = this.helper.dom.createElement('<textArea class="notes-text-area">'+this.taskNotes+'</textArea>');
		this.textArea.addEventListener(ComponentBase.EventType.CLICK, this.handleTextAreaEnable.bind(this));
		this.textArea.readonly = true;
		this.notesWrapper.appendChild(this.textArea);

		this.footerWrapper.appendChild(this.buddyLabel);

		this.finishTaskBttnNo = document.createElement('button');
		this.finishTaskBttnNo.className = "finish-task-bttn";
		this.finishTaskBttnNo.innerHTML = "No";
		this.finishTaskBttnNo.addEventListener(ComponentBase.EventType.CLICK, this.handleFinishTaskCanceled.bind(this));
		this.finishTaskBttnNo.style.display = "none";
		this.footerWrapper.appendChild(this.finishTaskBttnNo);

		this.finishTaskBttnYes = document.createElement('button');
		this.finishTaskBttnYes.className = "finish-task-bttn";
		this.finishTaskBttnYes.innerHTML = "Yes";
		this.finishTaskBttnYes.addEventListener(ComponentBase.EventType.CLICK, this.handleFinishTaskConfirmed.bind(this));
		this.finishTaskBttnYes.style.display = "none";
		this.footerWrapper.appendChild(this.finishTaskBttnYes);

		this.finishTaskBttn = document.createElement('button');
		this.finishTaskBttn.className = "finish-task-bttn";
		this.finishTaskBttn.innerHTML = "Finish task";
		this.finishTaskBttn.addEventListener(ComponentBase.EventType.CLICK, this.handleFinishTask.bind(this));
		this.footerWrapper.appendChild(this.finishTaskBttn);

		this.saveNotesBttn = document.createElement('button');
		this.saveNotesBttn.className = "save-notes-bttn";
		this.saveNotesBttn.innerHTML = "Save notes";
		this.saveNotesBttn.addEventListener(ComponentBase.EventType.CLICK, this.handleSaveNotes.bind(this));
		this.footerWrapper.appendChild(this.saveNotesBttn);

		this.notifications = document.createElement('div');
		this.notifications.className = "notification-div";
		this.footerWrapper.appendChild(this.notifications);

		this.element = this.taskWrapper; //saving all DOM elements in the element of this object
	}

	/*
	Function, which handles behavior of the button for saving task notes.
	*/
	ComponentUserTaskDetail.prototype.handleSaveNotes = function() {
		if(this.textArea.value === this.taskNotes) {
			this.notifications.innerHTML = "Nothing has been changed.";
			//alert("Nothing has been changed.");
		}
		else {
			this.saveNotesBttn.disabled = true;
			this.textArea.readonly = true;
			this.taskNotes = this.textArea.value;

			var dataToSend = {
				id_task: this.taskId,
			 	notes: this.taskNotes
			 };

			var model = new Model (ComponentUserTaskDetail.EventType.DATA_UPDATE);
			this.listen(ComponentUserTaskDetail.EventType.DATA_UPDATE, model, this.saveNotesConfirmed);
			hrtool.actions.updateUserTaskData(model, dataToSend);
		}
	}

	/*
	Function, which will be executed, when saving notes operation is succesfully completed.
	*/
	ComponentUserTaskDetail.prototype.saveNotesConfirmed = function() {
		this.saveNotesBttn.disabled = false;
		this.notifications.innerHTML = "Save succesfull.";
		//alert("Save succesfull.");
	}

	/*
	Function, which handles behavior of the button for finishing task.
	*/
	ComponentUserTaskDetail.prototype.handleFinishTask = function() {
		if(this.isFinished) {
			this.notifications.innerHTML = "Already completed.";
			//alert("Already completed.");
		}
		else {
			this.setButtonsDisplay(true);
		}
	}

	/*
	Function, which handles behavior of the button for confirm the finish of the task.
	*/
	ComponentUserTaskDetail.prototype.handleFinishTaskConfirmed = function() {
		this.finishTaskBttnYes.disabled = true;
		this.finishTaskBttnNo.disabled = true;

		var dataToSend = {id_task: this.taskId};

		model = new Model (ComponentUserTaskDetail.EventType.TASK_FINISH);
		this.listen(ComponentUserTaskDetail.EventType.TASK_FINISH, model, this.finishTaskOk);
		hrtool.actions.finishUserTask(model, dataToSend);
	}

	/*
	Function, which will be executed, when finishing operation is succesfully completed.
	*/
	ComponentUserTaskDetail.prototype.finishTaskOk = function() {
		this.finishTaskBttnYes.disabled = false;
		this.finishTaskBttnNo.disabled = false;

		this.setButtonsDisplay(false);

		this.notifications.innerHTML = "Task has been completed.";
		//alert("Task has been completed.");

		this.isFinished = true;
		this.fire(ComponentBase.EventType.CHANGE, this.isFinished); //function for notifying the parrent list of this task detail about finishing
	}

	/*
	Function, which handles behavior of the button for cancel the finish of the task.
	*/
	ComponentUserTaskDetail.prototype.handleFinishTaskCanceled = function() {
		this.setButtonsDisplay(false);
	}

	ComponentUserTaskDetail.prototype.setButtonsDisplay = function(display) {
		var a = 'none'
	    var b = 'initial'

	    if(display == true) {
	    	this.finishTaskBttn.style.display = a;
	    	this.finishTaskBttnYes.style.display = b;
	    	this.finishTaskBttnNo.style.display = b;
	    }
	    else {
	    	this.finishTaskBttn.style.display = b;
	    	this.finishTaskBttnYes.style.display = a;
	    	this.finishTaskBttnNo.style.display = a;
	    }  
	}

	/*
	Function, which handles property read-only of the text area for task description.
	*/
	ComponentUserTaskDetail.prototype.handleTextAreaEnable = function() {
		this.textArea.readonly = false;
	}

	ComponentUserTaskDetail.EventType = {DATA_UPDATE: 'tasks/update', TASK_FINISH: 'tasks/finish'};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);
	var ComponentBaseTaskDetail = __webpack_require__(15);

	var ComponentBuddyTaskList = module.exports = function() {
		ComponentBase.call(this);
		this.super = ComponentBase;
		this.data = null;
	}

	ComponentBuddyTaskList.prototype = new ComponentBase();
	ComponentBuddyTaskList.prototype.constructor = ComponentBuddyTaskList;

	ComponentBuddyTaskList.prototype.onLoad = function(data) {
		this.data = data;

		for(var i = 0; i < this.data.length; i++) {
			var taskData = this.data[i];

			var taskDataModified = {
				taskBuddy: taskData.email,
				taskTitle: taskData.title,
				dateFrom: taskData.date_from,
				dateTo: taskData.date_to,
				taskDescription: taskData.description,
				taskNotes: taskData.notes,
				isFinished: taskData.completed
			};

			var task = new ComponentBaseTaskDetail(taskDataModified);
			this.addChild("buddyTask"+i, task, {'el': this.getElement()});

			if(this.rendered) {
				this.getElement().appendChild(task.getElement());
			}
		}
		//this.render(this.element.parrentNode);
	}

	ComponentBuddyTaskList.prototype.createDom = function() {
		var wrapper = document.createElement('div');
		wrapper.className = "buddy-task-list";
		this.element = wrapper;
	}

	ComponentBuddyTaskList.EventType = {
		DATA_LOAD: 'tasks/buddy/list',
		DATA_LOAD_COMPLETED: 'tasks/buddy/list/completed',
		DATA_LOAD_NOT_COMPLETED: 'tasks/buddy/list/not-completed'
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBuddyTaskList = __webpack_require__(17);
	var Model = __webpack_require__(26);
	var hrtool = __webpack_require__(24);
	var ComponentBuddyTaskListFactory = module.exports = {

		createCompleted: function() {
			var buddyTaskList = new ComponentBuddyTaskList();
			var buddyTaskListModel = new Model(ComponentBuddyTaskList.EventType.DATA_LOAD_COMPLETED);
			buddyTaskList.setModel(buddyTaskListModel, ComponentBuddyTaskList.EventType.DATA_LOAD_COMPLETED);
			hrtool.actions.getBuddyTaskDataCompleted(buddyTaskList.model);
			return buddyTaskList;
		},

		createNotCompleted: function() {
			var buddyTaskList = new ComponentBuddyTaskList();
			var buddyTaskListModel = new Model(ComponentBuddyTaskList.EventType.DATA_LOAD_NOT_COMPLETED);
			buddyTaskList.setModel(buddyTaskListModel, ComponentBuddyTaskList.EventType.DATA_LOAD_NOT_COMPLETED);
			hrtool.actions.getBuddyTaskDataNotCompleted(buddyTaskList.model);
			return buddyTaskList;
		},

		createAll: function() {
			var buddyTaskList = new ComponentBuddyTaskList();
			var buddyTaskListModel = new Model(ComponentBuddyTaskList.EventType.DATA_LOAD);
			buddyTaskList.setModel(buddyTaskListModel, ComponentBuddyTaskList.EventType.DATA_LOAD);
			hrtool.actions.getBuddyTaskData(buddyTaskList.model);
			return buddyTaskList;
		}
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);
	var ComponentBuddyTaskListFactory = __webpack_require__(18);
	var ComponentHide = __webpack_require__(13);

	var ComponentBuddyTasksListsInView  = module.exports = function() {
		ComponentBase.call(this);
		this.super = ComponentBase;
		this.listNotFinished = ComponentBuddyTaskListFactory.createNotCompleted();
		this.listFinished = ComponentBuddyTaskListFactory.createCompleted();
	}

	ComponentBuddyTasksListsInView.prototype = new ComponentBase();
	ComponentBuddyTasksListsInView.prototype.constructor = ComponentBuddyTasksListsInView;

	ComponentBuddyTasksListsInView.prototype.createDom = function() {

		var outerHideWrapper = document.createElement('div');
		outerHideWrapper.className = "outer-hide-wrapper";

		var listsWrapper = document.createElement('div');
		listsWrapper.className = "buddy-lists-wrapper";

		var notFinishedTasksWrapper = document.createElement('div');
		notFinishedTasksWrapper.className = "not-finished-tasks-wrapper";

		var finishedTasksWrapper = document.createElement('div');
		finishedTasksWrapper.className = "finished-tasks-wrapper";

		var hideAll = new ComponentHide(this.helper.dom.createElement('<h1 class="buddy-lists-title">Tasks, for which you are listed as buddy:</h1>'), listsWrapper, false);
		hideAll.render(outerHideWrapper);

		var hideNotFinished = new ComponentHide(this.helper.dom.createElement('<h2 class="not-finished-tasks-title">Tasks, which are still being worked on:</h2>'), notFinishedTasksWrapper, false);
		hideNotFinished.render(listsWrapper);

		this.listNotFinished.render(notFinishedTasksWrapper);

		var hideFinished = new ComponentHide(this.helper.dom.createElement('<h2 class="finished-tasks-title">Tasks, which have been already finished:</h2>'), finishedTasksWrapper, true);
		hideFinished.render(listsWrapper)

		this.listFinished.render(finishedTasksWrapper);

		this.element = outerHideWrapper;
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentBase = __webpack_require__(3);
	var Model = __webpack_require__(26);
	var ComponentFilter = __webpack_require__(11);
	var helper = __webpack_require__(23);
	var ComponentFilterFormatter = __webpack_require__(12);

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
	    var dropDownData = ComponentFilterFormatter.factory.createTeamDropdowns(this.helper.bulk.getData(['departments']), this.helper.bulk.getData(['teams']));
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
	    var dropdown = new ComponentFilter(data.dd, ['department', 'teams']);
	    this.dropdowns[id] = dropdown;
	    this.getElement().appendChild(task); //because I need addChild to exist div

	    var div = document.createElement("div");
	    var el = document.createElement('input');

	    //create title input
	    div.className = divsName.title;
	    el.type = "text";
	    el.className = divsName.title + " text";
	    el.value = data.data[divsName.title ];
	    el.disabled = true;
	    div.appendChild(el);
	    task.appendChild(div);

	    //create description input
	    div = document.createElement("div");
	    el = document.createElement('input');
	    div.className = divsName.description;
	    el.type = "text";
	    el.className = divsName.description + " text";
	    el.value = data.data[divsName.description ];
	    el.disabled = true;
	    div.appendChild(el);
	    task.appendChild(div);

	    //create department and team
	    div = document.createElement("div");
	    div.className = divsName.id_department;
	    task.appendChild(div);
	    dropdown.render(div);
	    this.addChild(divsName.id_department + dropdown.componentId, dropdown, {el: div});

	    //create save button
	    div = document.createElement("div");
	    el = document.createElement("button");
	    div.className = divsName.route;
	    el.className = "button save";
	    el.innerHTML = "Save";
	    div.appendChild(el);

	    //create delete button
	    el = document.createElement("button");
	    el.className = "button delete";
	    el.innerHTML = "Delete";
	    if (data.data.implicit) {
	        //el.disabled = true;//TODO: implement after implementation at server side will be done
	    }
	    div.appendChild(el);
	    task.appendChild(div);

	    return task;
	};

	ComponentTemplateList.prototype.createHeader = function (div) {
	    var elDivHead = document.createElement("div");
	    elDivHead.className = "template-header";
	    for (var item in ComponentTemplateList.TemplateListDivs) {
	        var elem = document.createElement('div');
	        elem.className = "template-header-item";
	        elem.innerText = ComponentTemplateList.TemplateListDivs[item];
	        if(ComponentTemplateList.TemplateListDivs.id_department == item){
	            elem.innerText = ComponentTemplateList.TemplateListDivs[item];
	        }
	        elDivHead.appendChild(elem);
	        div.appendChild(elDivHead);
	    }
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
	    var dropdownStatus = this.dropdowns[data.id].getStatus();
	    titleEl.disabled = true;
	    descEl.disabled = true;
	    var dep = dropdownStatus[0].id;
	    var team = dropdownStatus[1].id;
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
	};

	ComponentTemplateList.prototype.handleButtonDelete = function (data) {
	    var deleteModel = new Model(ComponentTemplateList.EventType.DATA_DELETE);
	    data.object.disabled = true;
	    this.listen(ComponentTemplateList.EventType.DATA_DELETE, deleteModel, this.onDelete.bind(this, data.object));
	    hrtool.actions.deleteDefaultTaskData(deleteModel, {id_task_template: parseInt(data.id)});
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
	        var rowEl = helper.dom.getParentByClass(objEl, "row");
	        rowEl.innerHTML = "";
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


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var ComponentTemplateList = __webpack_require__(20);
	var Model = __webpack_require__(26);
	var hrtool = __webpack_require__(24);
	var ComponentTemplateListFactory = module.exports = {
	    createAll: function() {
	        var componentTemplateList = new ComponentTemplateList();
	        componentTemplateList.setModel(new Model(ComponentTemplateList.EventType.DATA_LOAD),ComponentTemplateList.EventType.DATA_LOAD);
	        hrtool.actions.getTemplatesData(componentTemplateList.model);
	        return componentTemplateList;
	    }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var Const = module.exports  = 
	{
		"develop": true
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var Const = __webpack_require__(22);
	var app = __webpack_require__(1);

	//helper containing formating and other functions
	var helper = module.exports = {
		format: {
			//function for converting number (in parameter) to precentage representated by returning string
			getPercentage: function(num) {
				if(!(isNaN(num))) {
					var result = (num * 100).toFixed(2)+"%";
					return result;
				}
				else {
					return ("Can't get the percentage, input is not a number!");
				}
			},

			getDate: function(date) {
				var dateFormated = date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear();
				return dateFormated;
			}
		},

		dom: {
			//function for converting string into DOM element
			createElement: function(str) {
				var myElement = $(str);
				return myElement[0];
			},
	        getParentByClass: function (el, className) {
	            while (el && el.className !== className) {
	                el = el.parentNode;
	            }
	            if(el)
	                return el;
	            return null;
	        }
		},
		//helper.bulk.getData(['user','id_user'])
		bulk: {

			getData: function(keys){
				return helper.obj.getData(app.bulk, keys);
			}
		},
		obj: {
			getData: function(obj, keys){
				var tmpBulk = obj;
				for(var i = 0; i< keys.length; i++){
					if(tmpBulk[keys[i]] != null){
						tmpBulk = tmpBulk[keys[i]];
					}
					else {
						helper.debugger('Error: parameter ' + keys[i] + ' in bulk is null');

						return null;
					}
				}
				return tmpBulk;
			}
		},
		//helper.debugger('id', {data})
		debugger: function(eventName, data){
			if(Const.develop){
				if(data != null){
					console.log(eventName, data);
				}
				else{
					console.log(eventName, "No data");
				}
			}
		},
	    date: {
	        getDiffDate: function (date1, date2){ // number of days between two dates
	            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	            firstDate = new Date(date1);
	            secondDate = new Date(date2);
	            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
	            return diffDays;
	        },
	        handleOnBlurDate: function(){
	            var time = ComponentTaskImplicit.prototype.getDateNow();
	            if(event.currentTarget.value < time.toString || event.currentTarget.value > time.toString)
	                event.currentTarget.value = time.toString;
	        }
	    },
	    number: {
	        //Use for example isNumber(number,minimum,maximum), use isNumber(5,"","") if you don't need bounds.
	        isNumber: function (num,min,max) {
	            var out = parseInt(num);
	            if(!out)
	                return false;
	            if( min == "")
	                min = Number.MIN_VALUE;
	            if( max == "")
	                max = Number.MAX_VALUE;
	            if(out > min || out < max)
	                return true;
	            return false;
	        }
	    }
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var Mediator = __webpack_require__(25);

	var hrtool = module.exports = hrtool || {}

	hrtool.actions = {
	    getTestData: function(model){
	        var mediator = new Mediator();
	//        mediator.loadData('test-data',{},model);
	        mediator.fakeLoadData('test-data',{},model);
	    },
	    getTaskData: function (model) {
	            var mediator = new Mediator();
	            //        mediator.loadData('test-data',{},model);
	            mediator.loadData('tasks/get-all', {}, model);
	    },
	    getTemplatesData : function(model){
	        var mediator = new Mediator();
	        mediator.loadData('template/get-all', {}, model);
	    },
	    saveDefaultTaskData: function (model,data) {
	        var mediator = new Mediator();
	        mediator.loadData('template/update', data, model);
	    },
	    deleteDefaultTaskData: function (model,data) {
	        var mediator = new Mediator();
	        mediator.loadData('template/delete', data, model);
	     },

	    getBuddyTaskData: function (model) {
	    	var mediator = new Mediator();
	    	mediator.loadData('tasks/buddy/list', {}, model);
	    },

	    getBuddyTaskDataCompleted: function (model) {
	    	var mediator = new Mediator();
	    	mediator.loadData('tasks/buddy/list/completed', {}, model);
	    },

	    getBuddyTaskDataNotCompleted: function (model) {
	    	var mediator = new Mediator();
	    	mediator.loadData('tasks/buddy/list/not-completed', {}, model);
	    },
	    saveImplicitTaskData: function (model,data) {
	        var mediator = new Mediator();
	        mediator.loadData('tasks/implicit/insert', data, model);
	    },
	     getUserTaskData: function(model) {
	     	var mediator = new Mediator();
	     	mediator.loadData('tasks/user/list', {}, model);
	     },

	     updateUserTaskData: function(model, data) {
	     	var mediator = new Mediator();
	     	mediator.loadData('tasks/update', data, model);
	     },

	     finishUserTask: function(model, data) {
	     	var mediator = new Mediator();
	     	mediator.loadData('tasks/finish', data, model);
	     }
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	
	var Mediator =  module.exports = function() {

	}

	/*
	* @returns {object} singleton socket
	*/
	Mediator.prototype.getSocket = function() {
		if (Mediator.socket == null) {
			Mediator.socket = io.connect();
		}
		return Mediator.socket;
	};

	/* call backend to retrieve data
	* @param {string} endpoint
	* @param {object} params parameters
	* @param {object} model
	* @param {object} transform transformation of loaded data
	*/
	Mediator.prototype.loadData = function (endpoint, params, model, transform) {
	    this.getSocket().emit(endpoint, params, function (resp) {
	        if (resp.error) {
	            console.log("error: ", resp.error);
	        } else {
	            if (transform != null) {
	                resp.data = transform(resp.data);
	            }
	            model.update(resp.data);
	        }
	    });

	};

	Mediator.prototype.fakeLoadData = function(endpoint, params, model, transform) {
	    update = model.update.bind(model);
	    setTimeout(function() {
	        var resp = {
	            'roman': {
	                'car': 'bmw'
	            },
	            'marek': {
	                'car': 'porsche'
	            },
	            'mirek': {
	                'car': 'skoda'
	            }
	        }
	        update(resp);
	    }, 3000);
	}






/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var EventEmitter =__webpack_require__(27);
	var Model =   module.exports = function(eventType) {
	    EventEmitter.call(this);
	    this.super = EventEmitter;
	    this.eventType = eventType;
	    this.data = null;
	}

	Model.prototype = new EventEmitter();
	Model.prototype.constructor = Model;

	Model.prototype.update = function(data){
	    this.data = data;
	    this.onUpdate();
	}

	Model.prototype.onUpdate = function(){
	    this.fire(this.eventType, this.data);
	}






/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var Observer = __webpack_require__(28);

	/**
	 * Constructor of Observable component: creates new component
	 * and provides it with a new ID.
	 * @returns {EventEmitter}
	 */
	var EventEmitter = module.exports = function() {
	    this.componentId = ++EventEmitter._componentId;
	};

	EventEmitter._componentId = 0;

	EventEmitter.getObserver = function () {
	    if(!EventEmitter.observer) {
	        EventEmitter.observer = new Observer();
	    }
	    
	    return EventEmitter.observer;
	};

	/**
	 * Lets the component listen to an event of given type fired by given sources.
	 * Listens to all sources when src is not provided.
	 * @param {string} type type of event to listen
	 * @param {object} src sources to listen to
	 * @param {function} fn function to call when event triggered
	 * @returns {undefined}
	 */
	EventEmitter.prototype.listen = function (type, src, fn) {
	    fn = fn.bind(this);
	    EventEmitter.getObserver().on(type, fn, src);
	};

	/**
	 * Fires an event of given type with data provided.
	 * @param {string} type type of event being fired
	 * @param {type} data anything to be passed on the listeners
	 * @returns {undefined}
	 */
	EventEmitter.prototype.fire = function (type, data) {
	    EventEmitter.getObserver().fire(type, data, this.componentId);
	};

	/**
	 * Sets the compnent as parent of given EventEmitter.
	 * @param {EventEmitter} child child to be adopted
	 * @returns {undefined}
	 */
	EventEmitter.prototype.setAsChild = function (child) {
	    EventEmitter.getObserver().mapOfComponents[child.componentId] = this.componentId;
	};

	/**
	 * Deletes the component from map of components, unsubscribes it from all
	 * listeners and removes it as a source from observer.
	 * @param {number} componentId ID of component to remove
	 * @returns {undefined}
	 */
	EventEmitter.prototype.removeListeners = function (componentId) {
	    if(EventEmitter.getObserver().mapOfComponents[componentId])
	        delete EventEmitter.getObserver().mapOfComponents[componentId];
	    EventEmitter.getObserver().removeListener(componentId);
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Constructor of class Observer: creates new map of components
	 * (an object /associative array/, where the key is the component's ID
	 * and the value is its parent's ID.
	 * 
	 * It also creates a map of publishers with this structure:
	 * map {object}
	 * |
	 * |-------type of event {object}
	 * |         |----publisher's ID {object}
	 * |         |            |----function to call {function}
	 * |         |----publisher's ID {object}
	 * |                      |----function to call {function}
	 * |
	 * |-------type of event {object}
	 *           |----publisher's ID {object}
	 *           |            |----function to call {function}
	 *           |----publisher's ID {object}
	 *                        |----function to call {function}
	 * @returns {Observer}
	 */
	var Observer = module.exports = function () {
	    this._subscribers = {};
	    this.mapOfComponents = {};
	};

	/**
	 * Fires an event and notifies all parents listening to the event type.
	 * @param {string} type type of event being fired
	 * @param {type} data data to pass on the listeners
	 * @param {number} src source of event
	 * @returns {undefined}
	 */
	Observer.prototype.fire = function (type, data, src) {
	    var parents = this._getParents(src);
	    
	    while(parents.length > 0) {
	        var id = parents.pop();
	        if(this._subscribers[type] && this._subscribers[type][id]) {
	            this._subscribers[type][id](data, src);
	        }
	    }
	};

	/**
	 * Finds all components that contains (directly or not) given component.
	 * @param {number} childId Id of component that we want to find parents of.
	 * @returns {Observer.prototype._getParents.parents|Array}
	 */
	Observer.prototype._getParents = function(childId) {
	    var parents = [];
	    var iter = childId;
	    
	    while(iter) {
	        parents.push(iter);
	        iter = this.mapOfComponents[iter];
	    }
	    
	    return parents;
	};

	/**
	 * Subscribes caller to given type of event.
	 * @param {ObservableComponent} calee caller of the function
	 * @param {string} type type of event
	 * @param {function} fn function to call when event triggered
	 * @param {object} owner ObservableComponent that fired an event
	 * @returns {undefined}
	 */
	Observer.prototype.on = function (type, fn, owner) {
	    if(typeof (fn) !== "function") {
	        return;
	    }

	    if(this._subscribers[type] === undefined) {
	        this._subscribers[type] = {};
	    }

	    var typeItem = this._subscribers[type];

	    if(typeItem[owner.componentId] === undefined) {
	        typeItem[owner.componentId] = {};
	    }

	    typeItem[owner.componentId] = fn;
	};

	/**
	 * Removes all listeners of given component's id
	 * @param {number} listenerId
	 * @returns {undefined}
	 */
	Observer.prototype.removeListener = function (listenerId) {
	    for(var itemEvent in this._subscribers) {
	        if(listenerId in this._subscribers[itemEvent]) {
	            delete this._subscribers[itemEvent][listenerId];
	        }
	    }
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var RouterConfig = __webpack_require__(30);
	var ViewBase = __webpack_require__(31);
	var Router = module.exports = function () {
	}

	Router.prototype.init = function () {
	    var path = this.getPath();
	    this.routerConfig = new RouterConfig();
	    this.changeView(path);

	}
	Router.prototype.getPath = function () {

	    var url = window.location.hash;
	    if (url != "") {
	        var map = {};
	        var output = {
	            view: "", parameters: ""
	        };
	        var arr = url.split('?');
	        //get parameters
	        if (arr[1]) {
	            var params = arr[1];
	            var vars = params.split("&");
	            for (var i = 0; i < vars.length; i++) {
	                var pair = vars[i].split("=");
	                map[pair[0]] = pair[1];
	            }
	            output['parameters'] = map;
	        }
	        //get views
	        var index = arr[0].lastIndexOf('#');
	        output['view'] = arr[0].substring(index + 1);
	        return output;
	    }
	    else return { view: "", parameters: "" };
	}

	Router.prototype.changeView = function () {

	    this.view = this.routerConfig.setView(this.getPath());
	    var _this = this;
	    var mainWrapper = document.getElementById(ViewBase.mainWrapper);
	    if (mainWrapper != null) {
	        mainWrapper.innerHTML = '';
	        this.view.render();
	    }
	    else {
	        document.addEventListener(CompoenntBase.EventType.DOMContentLoaded, function () {
	            document.removeEventListener(CompoenntBase.EventType.DOMContentLoaded, arguments.callee, false);
	            if (mainWrapper != null) {
	                mainWrapper.innerHTML = '';
	                _this.view.render();
	            }
	        }, false);
	    }
	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var ViewHome = __webpack_require__(34);
	var ViewDepartmentAdmin = __webpack_require__(33);
	var ViewPeopleAdmin = __webpack_require__(35);
	var ViewTaskAdmin = __webpack_require__(36);
	var ViewTest =__webpack_require__(37);
	var ViewDefault =__webpack_require__(32);

	var RouterConfig = module.exports = function () { }

	RouterConfig.prototype.setView = function(data) {
	    var curView;
	    //if you wat to add parameters, use data.parameters
	    switch (data.view) {
	        case 'home':
	            return curView = new ViewHome();
	        case 'departmentAdmin':
	            return curView = new ViewDepartmentAdmin();
	        case 'peopleAdmin':
	            return curView = new ViewPeopleAdmin();
	        case 'taskAdmin':
	            return curView = new ViewTaskAdmin();
	        case 'test':
	            return curView = new ViewTest();
	        case 'checkbox':
	            return curView = new ViewTestCheckBox();
	        case 'test':
	            return curView = new ViewTest();
	        default:
	            return new ViewHome();
	    }
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var EventEmitter = __webpack_require__(27);
	var helper = __webpack_require__(23);
	var ComponentNavBar = __webpack_require__(5);

	var ViewBase = module.exports =	function(){

		EventEmitter.apply(this);
		this.super = EventEmitter;
		this.helper = helper;
	};	

	ViewBase.prototype = new EventEmitter();
	ViewBase.prototype.constructor = ViewBase;


	ViewBase.prototype.render = function(){
	    var navBar = new ComponentNavBar();
	    navBar.render();

		this.base = document.getElementById(ViewBase.mainWrapper);
		if(this.base != null){ //checks if, in body, exists main-wrapper
			while( this.base.childNodes.length > 0 ){
	     		this.base.removeChild(this.base.childNodes[0])
			}
		}
		else{	//Adds main-wrapper
			var body = document.getElementsByTagName("body")[0];
			var div = document.createElement("div");
			div.id = ViewBase.mainWrapper;
			body.appendChild(div);
		}
	};

	ViewBase.mainWrapper = "main-wrapper";


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var ViewBase =  __webpack_require__(31);

	var ViewDefault =  module.exports = function(){
		ViewBase.call(this,null);
		this.super = ViewBase;
	}
	ViewDefault.prototype = new ViewBase();
	ViewDefault.prototype.constructor = ViewDefault;

	ViewDefault.prototype.render = function(){
		this.super.prototype.render.apply(this, arguments);
		var mainWrapper = document.getElementById(this.super.mainWrapper);
		var div = document.createElement("div");
		div.id = "ViewDefault";
		div.innerText = "This is default view, you should not be seeing this (you should see other views instead).";
		mainWrapper.appendChild(div);
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var ViewBase =  __webpack_require__(31);

	var ViewDepartmentAdmin =  module.exports = function() {
		ViewBase.call(this);
		this.super = ViewBase;
	}

	ViewDepartmentAdmin.prototype = new ViewBase();
	ViewDepartmentAdmin.prototype.constructor = ViewDepartmentAdmin;

	ViewDepartmentAdmin.prototype.render = function() {

		this.super.prototype.render.apply(this, arguments);
		var mainWrapper = document.getElementById(this.super.mainWrapper);

		var viewWrapper = document.createElement('div');
		viewWrapper.className = "view-wraper";
		viewWrapper.innerHTML = "Department Admin View";

		mainWrapper.appendChild(viewWrapper);
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var ViewBase =  __webpack_require__(31);
	var ComponentBuddyTasksListsInView = __webpack_require__(19);

	var ViewHome = module.exports =  function() {
		ViewBase.call(this);
		this.super = ViewBase;

		this.buddyTaskLists = new ComponentBuddyTasksListsInView();
	}

	ViewHome.prototype = new ViewBase();
	ViewHome.prototype.constructor = ViewHome;

	ViewHome.prototype.render = function() {

		this.super.prototype.render.apply(this, arguments);
		var mainWrapper = document.getElementById(this.super.mainWrapper);

		var viewWrapper = document.createElement('div');
		viewWrapper.className = "view-wraper";
		viewWrapper.innerHTML = "Home View";

		this.buddyTaskLists.render(viewWrapper);

		mainWrapper.appendChild(viewWrapper);
	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var ViewBase =  __webpack_require__(31);

	var ViewPeopleAdmin = module.exports = function() {
		ViewBase.call(this);
		this.super = ViewBase;
	}

	ViewPeopleAdmin.prototype = new ViewBase();
	ViewPeopleAdmin.prototype.constructor = ViewPeopleAdmin;

	ViewPeopleAdmin.prototype.render = function() {

		this.super.prototype.render.apply(this, arguments);
		var mainWrapper = document.getElementById(this.super.mainWrapper);

		var viewWrapper = document.createElement('div');
		viewWrapper.className = "view-wraper";
		viewWrapper.innerHTML = "People Admin View";

		mainWrapper.appendChild(viewWrapper);
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var ViewBase =  __webpack_require__(31);

	var ViewTaskAdmin =  module.exports = function() {
		ViewBase.call(this);
		this.super = ViewBase;
	}

	ViewTaskAdmin.prototype = new ViewBase();
	ViewTaskAdmin.prototype.constructor = ViewTaskAdmin;

	ViewTaskAdmin.prototype.render = function() {

		this.super.prototype.render.apply(this, arguments);
		var mainWrapper = document.getElementById(this.super.mainWrapper);

		var viewWrapper = document.createElement('div');
		viewWrapper.className = "view-wraper";
		viewWrapper.innerHTML = "Task Admin View";

		mainWrapper.appendChild(viewWrapper);
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var ViewBase =  __webpack_require__(31);
	var ComponentCheckBox = __webpack_require__(9);
	var ComponentTaskImplicit = __webpack_require__(6);
	var ComponentHide = __webpack_require__(13);
	var ComponentBuddyTasksListsInView = __webpack_require__(19);
	var ComponentTasksTemplate = __webpack_require__(14);
	var helper = __webpack_require__(23);
	var ComponentFilter = __webpack_require__(11);
	var Model = __webpack_require__(26);
	var ComponentListVladLaz = __webpack_require__(4);
	var ComponentTemplateList = __webpack_require__(20);
	var ComponentTemplateListFactory = __webpack_require__(21);
	var hrtool = __webpack_require__(24);

	var ViewTest =  module.exports = function(){
	    ViewBase.call(this,null);
	    this.super = ViewBase;
	}

	ViewTest.prototype = new ViewBase();
	ViewTest.prototype.constructor = ViewTest;

	ViewTest.prototype.render = function(){
	    var mainWrapper = document.getElementById(this.super.mainWrapper);

	    //Neckar view___________________________________________________________________________
	    this.componentTemplateList = new ComponentTemplateListFactory.createAll();
	    var dataForImplicit = {id_task_template: 5, id_department: 2, id_team: 3, title: "title example"};
	    this.componentTaskImplicit = new ComponentTaskImplicit(dataForImplicit);
	    var neckarWrapper = document.createElement('div');
	    var NWrapper = document.getElementById(this.super.mainWrapper);
	    neckarWrapper.className = "neckar-wraper";
	    neckarWrapper.innerHTML = "Neckar view";
	    mainWrapper.appendChild(neckarWrapper);
	    var implicitWrapper = document.createElement('div');
	    neckarWrapper.appendChild(implicitWrapper);
	    var templateWrapper = document.createElement('div');
	    neckarWrapper.appendChild(templateWrapper);
	    this.componentTaskImplicit.render(implicitWrapper);
	    this.componentTemplateList.render(templateWrapper);


	    //Fanda View START
	    
	    var fandaDiv = document.createElement('div');
	    fandaDiv.id = "fanda-div";
	    var nadpisF = document.createElement('h2');
	    nadpisF.innerHTML ='Fanda\'s view<br/>';
	    fandaDiv.appendChild(nadpisF);
	    var componentCh = new ComponentCheckBox("CheckBox");
	    var el = document.createElement('div');
	    el.innerHTML = 'CheckBox...<br><br>';
	    fandaDiv.appendChild(el);
	    el.appendChild(componentCh.getElement());
	    
	    var viewWrapper = document.createElement('div');
	    viewWrapper.innerHTML = "<br/><br/>ComponentHide...<br><br>";

	    fandaDiv.appendChild(viewWrapper);
	    var div = document.createElement("div");
	    var c = new ComponentCheckBox("CheckBox");
	    var d = new ComponentCheckBox("CheckBox");

	    div.appendChild(c.getElement());
	    div.appendChild(d.getElement());

	    var b = new ComponentHide(helper.dom.createElement("<div>Tittel</div>"),div,false);
	    b.render(viewWrapper);

	    mainWrapper.appendChild(fandaDiv);
	    //Fanda View END

	    //Witz view___________________________________________________________________________

	    //this.super.prototype.render.apply(this, arguments);
	    var mainWrapper = document.getElementById(this.super.mainWrapper);

	    this.component = new ComponentCheckBox("CheckBox");
	    var el = document.createElement('div');
	    el.innerHTML = 'This view contains component CheckBox.<br><br>';
	    var body = document.getElementsByTagName('body')[0];
	    var witzDiv = document.createElement('div');
	    witzDiv.id = "witz-div"
	    witzDiv.innerHTML = '<br/><h2>Witz\'s view</h2>';

	    body.appendChild(witzDiv);

	    var component = new ComponentFilter([{'': [{value: "ahoj", id: 1},{value:"dobre", id: 2},{value: "terry", id: 3}]},
	        {'1': [{value: "svete", id: 1}, {value: "lidi", id: 2}], '2': [{value: "rano", id: 3}, {value: "pivo", id: 4}], '3': [{value: "pratchett", id: 5}]}]);

	    var component2 = new ComponentFilter([{'': [{value: "ahoj", id: 1},{value:"dobre", id: 2},{value: "terry", id: 3}]},
	        {'1': [{value: "svete", id: 1}, {value: "lidi", id: 2}], '2': [{value: "rano", id: 3}, {value: "pivo", id: 4}], '3': [{value: "pratchett", id: 5}]},
	        {'global-global': [{value: 'default1', id: 20}], '2-3': [{value:"lidi"}]}]);

	    component.render(witzDiv);
	    component2.render(witzDiv);






		var viewWrapper = document.createElement('div');
		viewWrapper.className = "view-wraper";
		viewWrapper.innerHTML = "Test view to see how componentHide works...<br><br>";

		mainWrapper.appendChild(viewWrapper);
		var div = document.createElement("div");
		var c = new ComponentCheckBox("CheckBox");
	    var d = new ComponentCheckBox("CheckBox");

	    div.appendChild(c.getElement());
	    div.appendChild(d.getElement());

		var b = new ComponentHide(helper.dom.createElement("<div>Tittel</div>"),div,false);
	    b.render(viewWrapper);

	//Zibby:
	    var zibbyDiv = document.createElement('div');
	    zibbyDiv.innerHTML = '<h3>Zibby div</h3>';
	    var component = new ComponentTasksTemplate();
	    component.render(zibbyDiv);
	    mainWrapper.appendChild(zibbyDiv);

	//Zibby END

	    //LAZ START
	    var divVladLaz = document.createElement("div");
	    divVladLaz.id = "VladLaz";

	    var titleVladLaz = document.createElement("h2");
	    titleVladLaz.id = "VladLazTitle";
	    titleVladLaz.innerText = "Testovaci pisecek Vladimira Laznicky:";
	    divVladLaz.appendChild(titleVladLaz);

	    var list = new ComponentListVladLaz();
	    list.render(divVladLaz);

	    mainWrapper.appendChild(divVladLaz);
	    //LAZ END
	};

/***/ }
/******/ ])