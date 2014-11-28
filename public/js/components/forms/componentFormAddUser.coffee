ComponentBase = require '../componentBase'
ComponentFilter = require '../features/componentFilter'
formater = require '../features/componentFilterFormatter'
ComponentDropdown = require '../features/componentDropdown'
ComponentCheckBox = require '../features/componentCheckBox'
Model = require '../../models/model'
hrtool = require '../../models/actions'
ComponentNotificationCenter = require '../../components/componentNotificationCenter'
app = require '../../app'


class ComponentFormAddUser extends ComponentBase
	constructor: ->
		super()
		@isSelectedHRBuddy = no
		model = new Model ComponentFormAddUser.eventType.DATA_LOAD
		@setModel model, ComponentFormAddUser.eventType.DATA_LOAD
		hrtool.actions.getHR(@model)


		
	createDom: ->
		@element = @helper.tpl.create "components/forms/componentFormAddUser"
		@name = @element.getElementsByClassName("input1")[0]
		@surname = @element.getElementsByClassName("input2")[0]
		@email = @element.getElementsByClassName("input3")[0]
	
		buttonSave = @element.getElementsByClassName("form-add-user-saveButton")[0]
		buttonSave.addEventListener ComponentBase.eventType.CLICK, @handleSaveForm, no
	
		@placeHolderFilter = @element.getElementsByClassName("form-add-user-filter")[0]
		@placeHolderDrop = @element.getElementsByClassName("form-add-user-drop")[0]
	
		@addComponents(@element.getElementsByClassName("form-add-user-column4")[0])
		@setFilterData()
		return
		
		
		
	addComponents: (wrapper) ->
		@checkBoxIsTeamAdmin = new ComponentCheckBox "is Team Admin"
		@checkBoxIsHR = new ComponentCheckBox "is HR"
	
		@addChild @checkBoxIsTeamAdmin.componentId, @checkBoxIsTeamAdmin, {el: wrapper}
		@addChild @checkBoxIsHR.componentId, @checkBoxIsHR, {el: wrapper}
		return



	setFilterData: ->
		departmentsData = app?.bulk?.departments
		teamsData = app?.bulk?.teams
		roleData = app?.bulk?.departmentRoles
	
		@data = formater.factory.createTeamRoleDropdownsData departmentsData, roleData, teamsData
	
		@filterDepRoleTeam = new ComponentFilter @data
	
		@placeHolderFilter ?= document.createElement "div"
		@addChild @filterDepRoleTeam.componentId, @filterDepRoleTeam, {el: @placeHolderFilter}
		unless @rendered
			@filterDepRoleTeam.render @placeHolderFilter
		return




	onLoad: (data) ->
		unless data.error
			@placeHolderDrop ?= document.createElement "div"
			dropData = @createDropDownData data
			unless @HRbuddys
				@HRbuddys = new ComponentDropdown dropData
				@addChild @HRbuddys.componentId, @HRbuddys, {el :@placeHolderDrop}
				@listen ComponentDropdown.eventType.CHANGE, @HRbuddys, @setSelectedHR
				if @rendered?
					@HRbuddys.render @placeHolderDrop
			else
				@HRbuddys.changeData dropData
				if @rendered?
					@HRbuddys.render @placeHolderDrop
		else
			@HRbuddys = new ComponentDropdown ComponentDropdown.EmptyOption
			@addChild @HRbuddys.componentId, @HRbuddys, {el: @placeHolderDrop}
			if @rendered?
				@HRbuddys.render @placeHolderDrop
		return



	createDropDownData: (data) ->
		d = data.map (item) ->
			value: "#{item.last_name} #{item.first_name}"
			id: item.id_user
		return d



	setSelectedHR: (data) =>
		@isSelectedHRBuddy = (data.id isnt -1)
		return




	handleSaveForm: (data) =>
		if @isValid() is yes
			data = 
				first_name: @name.value
				last_name: @surname.value
				email: @email.value
				is_admin: @checkBoxIsTeamAdmin.checked
				is_hr: @checkBoxIsHR.checked
				id_buddy: @HRbuddys.selected.id
				id_department_role: @filterDepRoleTeam._status[1].id
				id_team: @filterDepRoleTeam._status[2].id
	
			model = new Model ComponentFormAddUser.eventType.SAVE
			@listen ComponentFormAddUser.eventType.SAVE, model, @handleFormSent
			hrtool.actions.saveFormAddUser model, data
		return




	isValid : ->
		err = yes
		baseTime = ComponentNotificationCenter.DEFAULT_TIME
		if @name.value is ""
			@setInvalidInputClass @name
			div = document.createElement "div"
			div.innerText = "Name is not filled."
			@addNotification div, baseTime, ComponentNotificationCenter.eventType.ERROR
			baseTime += 1000
			err = no

		if @surname.value is ""
			@setInvalidInputClass @surname
			div = document.createElement "div"
			div.innerText = "Surname is not filled."
			@addNotification div, baseTime, ComponentNotificationCenter.eventType.ERROR
			baseTime += 1000
			err = no
	
		emptyEmail = no
		if @email.value is ""
			@setInvalidInputClass @email
			div = document.createElement "div"
			div.innerText = "Email is not filled."
			@addNotification div, baseTime, ComponentNotificationCenter.eventType.ERROR
			baseTime += 1000
			err = no
			emptyEmail = yes

		if emptyEmail is no
			if (@email.value).split("@").length isnt 2 or (@email.value).split("@")[1].split(".").length isnt 2
				@setInvalidInputClass @email
				div = document.createElement "div"
				div.innerText = "Bad format of email adress."
				@addNotification div, baseTime, ComponentNotificationCenter.eventType.ERROR
				baseTime += 1000
				err = no
	
		for status, i in @filterDepRoleTeam._status
			if status.id is -1
				dropDownButton = document.getElementById "component-#{@filterDepRoleTeam._dropdowns[i].componentId}dropdown-button"
				switch i
					when 0
						@setInvalidInputClass dropDownButton
						div = document.createElement "div"
						div.innerText = "Department is not selected."
						@addNotification div, baseTime, ComponentNotificationCenter.eventType.ERROR
						baseTime += 1000
						err = no
					when 1
						@setInvalidInputClass dropDownButton
						div = document.createElement "div"
						div.innerText = "Role is not selected."
						@addNotification div, baseTime, ComponentNotificationCenter.eventType.ERROR
						baseTime += 1000
						err = no
					when 2
						@setInvalidInputClass dropDownButton
						div = document.createElement "div"
						div.innerText = "Team is not selected."
						@addNotification div, baseTime, ComponentNotificationCenter.eventType.ERROR
						baseTime += 1000
						err = no
		unless @isSelectedHRBuddy
			@HRbuddys.setInvalidInputClass()
			div = document.createElement "div"
			div.innerText = "HR buddy is not selected."
			@addNotification div, baseTime, ComponentNotificationCenter.eventType.ERROR
			baseTime += 1000
			err = no
		return err





	handleFormSent: (data) =>
		unless data.error
			@helper.debugger "FormStatus: Form sent"
			div = document.createElement "div"
			div.innerText = "User Added"
			@addNotification div, ComponentNotificationCenter.DEFAULT_TIME, ComponentNotificationCenter.eventType.SUCCESS
			if @checkBoxIsHR.checked is yes
				model = new Model ComponentFormAddUser.eventType.DATA_LOAD
				@setModel model, ComponentFormAddUser.eventType.DATA_LOAD
				hrtool.actions.getHR @model
			@reset()
			@fire ComponentFormAddUser.eventType.SAVE, null
		else
			@helper.debugger "FormStatus: Err", data.error
			div = document.createElement "div"
			div.innerText = "User Not Added Error:" + data.error
			@addNotification div, ComponentNotificationCenter.DEFAULT_TIME, ComponentNotificationCenter.eventType.ERROR
		return




	reset: ->
		@name.value = ""
		@surname.value = ""
		@email.value = ""
		@name.focus()
		
		@filterDepRoleTeam.unselectAll()
		@checkBoxIsTeamAdmin.setChecked no
		@checkBoxIsHR.setChecked no
		@HRbuddys.setSelection ComponentDropdown.EmptyOption
		@isSelectedHRBuddy = no
		return




ComponentFormAddUser.eventType =
	SAVE:'formSave'
	DATA_LOAD: 'data-load'

module.exports = ComponentFormAddUser