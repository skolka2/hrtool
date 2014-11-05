var ComponentBase = require('../componentBase');
var ComponentFilter = require('../features/componentFilter');
var formater = require('../features/componentFilterFormatter');
var ComponentDropdown = require('../features/componentDropdown');
var ComponentCheckBox = require('../features/componentCheckBox');
var Model = require('../../models/model');
var hrtool = require('../../models/actions');
var ComponentNotificationCenter = require('../../components/componentNotificationCenter');

//Constructor
var ComponentFormAddUser =  module.exports =  function(){
	ComponentBase.call(this);
	this.super = ComponentBase;

	this.isSelectedHRBuddy = false;
    var model = new Model(ComponentFormAddUser.EventType.DATA_LOAD);
    this.setModel(model,ComponentFormAddUser.EventType.DATA_LOAD);
    
	hrtool.actions.getHR(this.model);
}

ComponentFormAddUser.prototype = new ComponentBase();
ComponentFormAddUser.prototype.constructor = ComponentFormAddUser;

//Creates skeleton of component
ComponentFormAddUser.prototype.createDom = function(){
	var mainEl = this.helper.tpl.create("components/forms/componentFormAddUser");

	this.name = mainEl.getElementsByClassName("input1")[0];
	this.surname = mainEl.getElementsByClassName("input2")[0];
	this.email = mainEl.getElementsByClassName("input3")[0];

	var buttonSave = mainEl.getElementsByClassName("form-add-user-saveButton")[0];
	buttonSave.addEventListener(ComponentBase.EventType.CLICK,this.handleSaveForm.bind(this),false);

	this.placeHolderFilter = mainEl.getElementsByClassName("form-add-user-filter")[0];
	this.placeHolderDrop = mainEl.getElementsByClassName("form-add-user-drop")[0]
	
	this.addComponents(mainEl.getElementsByClassName("form-add-user-column4")[0]);
	
	this.setFilterData();
	this.element = mainEl;
}  

// Adds component into this component
ComponentFormAddUser.prototype.addComponents = function(wrapper){
	this.checkBoxIsTeamAdmin = new ComponentCheckBox("is Team Admin");
	this.checkBoxIsHR = new ComponentCheckBox("is HR");

	this.addChild(this.checkBoxIsTeamAdmin.componentId, this.checkBoxIsTeamAdmin, {"el":wrapper});
	this.addChild(this.checkBoxIsHR.componentId, this.checkBoxIsHR,{"el":wrapper});
}

ComponentFormAddUser.prototype.setFilterData = function(){
	var departmentsData = this.helper.bulk.getData(['departments']);
	var teamsData = this.helper.bulk.getData(['teams']);
	var roleData = this.helper.bulk.getData(["departmentRoles"]);

	this.data = formater.factory.createTeamRoleDropdowns(departmentsData, roleData, teamsData);
	
	this.filterDepRoleTeam = new ComponentFilter(this.data);
    
    this.placeHolderFilter = this.placeHolderFilter || document.createElement("div");	
    this.addChild(this.filterDepRoleTeam.componentId,this.filterDepRoleTeam,{"el":this.placeHolderFilter});
    if(!this.rendered){
    	this.filterDepRoleTeam.render(this.placeHolderFilter);
    }
    
}
// Gets data from back end.
ComponentFormAddUser.prototype.onLoad = function(data){
	if(data.error == null){
		this.placeHolderDrop = this.placeHolderDrop || document.createElement("div");
		dropDown = this.createDropDownData(data);

		if(this.HRbuddys == null){

			this.HRbuddys = new ComponentDropdown(dropDown);
			this.addChild(this.HRbuddys.componentId,this.HRbuddys,{"el":this.placeHolderDrop});
			this.listen(ComponentDropdown.EventType.CHANGE,this.HRbuddys,this.setSelectedHR);
			if(this.rendered){
				this.HRbuddys.render(this.placeHolderDrop);
			}
		}
		else {
			this.HRbuddys.changeData(dropDown);
			if(this.rendered){
				this.HRbuddys.render(this.placeHolderDrop);
			}
		}
	}
	else {
		this.HRbuddys = new ComponentDropdown(ComponentDropdown.EmptyOption);
		this.addChild(this.HRbuddys.componentId,this.HRbuddys,{"el":this.placeHolderDrop});
		if(this.rendered){
			this.HRbuddys.render(this.placeHolderDrop);
		}
	}
}

// Creates data for dropdown
ComponentFormAddUser.prototype.createDropDownData = function(data){
	return data.map(function(item){
		return {
			value :item.last_name + " " + item.first_name,
			id: item.id_user
		};
	});
}

// That indicates if a dropdown was selected.
ComponentFormAddUser.prototype.setSelectedHR = function(data){
	this.isSelectedHRBuddy = (data.id != -1);
}
// Method that saves this form into database.
ComponentFormAddUser.prototype.handleSaveForm = function(){
	if(this.isValid()){
		var data = {
			"first_name": this.name.value,
			"last_name": this.surname.value,
			"email": this.email.value,
			"is_admin": this.checkBoxIsTeamAdmin.checked,
			"is_hr": this.checkBoxIsHR.checked,
			"id_buddy": this.HRbuddys.selected.id,
			"id_department_role": this.filterDepRoleTeam._status[1].id,
			"id_team": this.filterDepRoleTeam._status[2].id
		}

		var model = new Model(ComponentFormAddUser.EventType.SAVE);

	   	this.listen(ComponentFormAddUser.EventType.SAVE, model, this.handleFormSent);
		hrtool.actions.saveFormAddUser(model, data);
	}
}

ComponentFormAddUser.prototype.isValid = function(){
	var err = true;
	var baseTime = ComponentNotificationCenter.DEFAULT_TIME;
	if(this.name.value == ""){
		this.setInvalidInputClass(this.name);
		var div = document.createElement("div");
		div.innerText = "Name is not filled.";
		this.addNotification(div,baseTime,ComponentNotificationCenter.EventType.error); // Error event type
		baseTime += 1000;
		err = false;
	}
	if(this.surname.value == ""){
		this.setInvalidInputClass(this.surname);
		var div = document.createElement("div");
		div.innerText = "Surname is not filled.";
		this.addNotification(div,baseTime,ComponentNotificationCenter.EventType.error); // Error event type
		baseTime += 1000;
		err = false;
	}

	var emptyEmail = false;
	if(this.email.value == "" ){
		this.setInvalidInputClass(this.email);
		var div = document.createElement("div");
		div.innerText = "Email is not filled.";
		this.addNotification(div,baseTime,ComponentNotificationCenter.EventType.error); // Error event type
		baseTime += 1000;
		err = false;
		emptyEmail = true;
	}
	if(emptyEmail == false){
		if((this.email.value).split("@").length != 2 || (this.email.value).split("@")[1].split(".").length != 2){
			this.setInvalidInputClass(this.email);
			var div = document.createElement("div");
			div.innerText = "Bad format of email adress.";
			this.addNotification(div,baseTime,ComponentNotificationCenter.EventType.error); // Error event type
			baseTime += 1000;
			err = false;
		}
	}

	for(var i = 0; i< this.filterDepRoleTeam._status.length;i++){
		if(this.filterDepRoleTeam._status[i].id ==-1){
			if(i == 0){
				var dropDownButton = document.getElementById("component-"+this.filterDepRoleTeam._dropdowns[i].componentId+"dropdown-button");
				this.setInvalidInputClass(dropDownButton);
				
				var div = document.createElement("div");
				div.innerText = "Department is not selected.";
				this.addNotification(div,baseTime,ComponentNotificationCenter.EventType.error); // Error event type
				baseTime += 1000;
				err = false;
			}
			if(i == 1){
				var dropDownButton = document.getElementById("component-"+this.filterDepRoleTeam._dropdowns[i].componentId+"dropdown-button");
				this.setInvalidInputClass(dropDownButton);
				var div = document.createElement("div");
				div.innerText = "Role is not selected.";
				this.addNotification(div,baseTime,ComponentNotificationCenter.EventType.error); // Error event type
				baseTime += 1000;
				err = false;
			}
			if(i == 2){
				var dropDownButton = document.getElementById("component-"+this.filterDepRoleTeam._dropdowns[i].componentId+"dropdown-button");
				this.setInvalidInputClass(dropDownButton);
				var div = document.createElement("div");
				div.innerText = "Team is not selected.";
				this.addNotification(div,baseTime,ComponentNotificationCenter.EventType.error); // Error event type
				baseTime += 1000;
				err = false;
			}
		}
	}
	if(!this.isSelectedHRBuddy){
		this.HRbuddys.setInvalidInputClass();
		var div = document.createElement("div");
		div.innerText = "HR buddy is not selected.";
		this.addNotification(div,baseTime,ComponentNotificationCenter.EventType.error); // Error event type
		baseTime += 1000;
		err = false;
	}

	return err;
}

ComponentFormAddUser.prototype.handleFormSent = function(data){
	if(data.error == null){
		this.helper.debugger("FormStatus: Form sent");
		var div = document.createElement("div");
		div.innerText = "User Added";
		this.addNotification(div,ComponentNotificationCenter.DEFAULT_TIME,ComponentNotificationCenter.EventType.success);
		if(this.checkBoxIsHR.checked){
			var model = new Model(ComponentFormAddUser.EventType.DATA_LOAD);
		    this.setModel(model,ComponentFormAddUser.EventType.DATA_LOAD);
			hrtool.actions.getHR(this.model);
		}
		this.reset();
		this.fire(ComponentFormAddUser.EventType.SAVE, null);

	}
	else {
		this.helper.debugger("FormStatus: Err", data.error);
		var div = document.createElement("div");
		div.innerText = "User Not Added Error:" + data.error;
		this.addNotification(div,ComponentNotificationCenter.DEFAULT_TIME,ComponentNotificationCenter.EventType.error); // Error event type
	}
}

// Resets form to default state.
ComponentFormAddUser.prototype.reset = function(){
	this.name.value = "";
	this.surname.value = "";
	this.email.value = "";
	this.name.focus();
	
	this.filterDepRoleTeam.unselectAll();
	this.checkBoxIsTeamAdmin.setChecked(false);
	this.checkBoxIsHR.setChecked(false);
	this.HRbuddys.setSelection(ComponentDropdown.EmptyOption);
	this.isSelectedHRBuddy = false;
}

ComponentFormAddUser.EventType = {
	SAVE:'formSave',
	DATA_LOAD: 'data-load'
}