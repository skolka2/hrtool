ComponentBase = require '../../../componentBase' 
ComponentLeft = require './componentLeft' 
ComponentRight = require './componentRight' 
ComponentTabbedArea = require '../../componentTabbedArea' 
ComponentFilterFormatter = require '../../componentFilterFormatter' 
ComponentFilter = require '../../componentFilter' 
ComponentDropdown = require '../../componentDropdown' 
Model = require '../../../../models/model' 
hrtool = require '../../../../models/actions' 
Const = require '../../../../helpers/constants' 
NotificationCenter = require '../../../componentNotificationCenter' 


class ComponentAddTask extends ComponentBase
	constructor: () ->
		super()
		@_leftComponent = new ComponentLeft();
		@_rightComponent = new ComponentRight();
		@_tabbedAreaComponent = new ComponentTabbedArea ['New task', 'Choose template'],[[@_leftComponent], [@_rightComponent]]

		@setModel new Model(ComponentAddTask.EventType.GET_USERS), ComponentAddTask.EventType.GET_USERS
		hrtool.actions.getUsers @model

		@taskModel = new Model ComponentAddTask.EventType.INSERT_NEW_TASK
		@listen ComponentAddTask.EventType.INSERT_NEW_TASK, @taskModel, @onSave

		@templateModel = new Model ComponentAddTask.EventType.INSERT_NEW_TEMPLATE


	onLoad: (data) ->
		departments = @helper.bulk.getDepartmentData();
		teams = @helper.bulk.getTeamData();
		users = {};
		buddies = {};

		for item in data
			buddies[item.id_user] = item
			users[item.unique_id] = item

		data2 = ComponentFilterFormatter.factory.createUsersDropdownsData departments, teams, users
		@_componentFilter = new ComponentFilter data2, ['department', 'team', 'user'], [false, false, true]
		@addChild 'componentFilter', @_componentFilter, {el: @_personWrapper}
		@_componentFilter.render @_personWrapper
		@listen ComponentDropdown.EventType.CHANGE, @_componentFilter, @handleDropdownChange
	
		buddies = ComponentFilterFormatter.transform buddies, 'id_user', 'full_name'
		@_buddyDropdown = new ComponentDropdown buddies[''], true
		@addChild 'buddyDropdown', @_buddyDropdown, {el: @_personWrapper}
		@_buddyDropdown.render @_personWrapper
		return


	onSave: (data) ->
		if data.name? is 'error'
			@addNotification "Something messed up during saving!\n error code: #{data.code?}",
				ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error
		else
			@addNotification 'Saving was successful!', ComponentAddTask.NOTIFICATION_DURATION,
				NotificationCenter.EventType.success
		return


	createDom: () ->
		today = @helper.format.getDateInputFormat new Date()
		jadeData =
			today: today
			personTitle: 'Person:'
			dateTitle: 'Task starts at:'
			dateInputClass: @componentId + '-date-input'
			dateLabelClass: 'date-label'
			taskLengthTitle: 'Task length (days):'
			taskLengthInputClass: @componentId + '-length-input'
			taskLengthLabelClass: 'task-length-label'
			saveButtonClass: @componentId + '-save-button'
			saveButtonTitle: 'Save'
			wrapperClass: ComponentAddTask.WRAPPER_CLASS
			personWrapperClass: ComponentAddTask.PERSON_WRAPPER_CLASS
			bottomWrapperClass: ComponentAddTask.BOTTOM_WRAPPER_CLASS
	
		@element = @helper.tpl.create 'components/features/addTask/newTask/componentAddTask', jadeData
		@_personWrapper = @element.getElementsByClassName(ComponentAddTask.PERSON_WRAPPER_CLASS)[0]
		@_lengthInput = @element.getElementsByClassName(jadeData.taskLengthInputClass)[0];
		@_dateInput = @element.getElementsByClassName(jadeData.dateInputClass)[0];
		bottomDiv = @element.getElementsByClassName(ComponentAddTask.BOTTOM_WRAPPER_CLASS)[0];
	
		tabbedAreaDiv = document.createElement 'div'
		@element.insertBefore tabbedAreaDiv, bottomDiv
		@addChild 'tabbedArea', @_tabbedAreaComponent, {el: tabbedAreaDiv}
	
		@saveButton = @element.getElementsByClassName(jadeData.saveButtonClass)[0]
		@saveButton.addEventListener ComponentBase.EventType.CLICK, @handleSaveClickEvent, false
	
		@element.addEventListener ComponentBase.EventType.CLICK, @handleClickEvent, false
		return


	handleSaveClickEvent: () =>
		userStatus = @_componentFilter.getStatus()
		selectedTab = @_tabbedAreaComponent.getSelectedTabNumber()
		taskStatus = if selectedTab is 0 then @_leftComponent.getStatus() else @_rightComponent.getStatus()
		team = userStatus.team.id
		department = userStatus.department.id
		length = @_lengthInput.value
		dateFrom = new Date @_dateInput.value
		correctlyFilled = @checkInputs userStatus, taskStatus, dateFrom, length, selectedTab
	
		if correctlyFilled
			dateTo = new Date(dateFrom.getTime() + (Number(length) * Const.MILIS_PER_DAY)).toDateString()
	
			switch selectedTab
				when 0    #new task is inserted
					title = taskStatus.title
					description = taskStatus.description
					template_team = taskStatus.team_id
					template_department = taskStatus.department_id
				when 1    #task template is chosen
					template = @_rightComponent.getSelectedTemplate(taskStatus.task_template.id)
					title = template.title
					description = template.description
					template_team = template.id_team
					template_department = template.id_department
	
			if selectedTab is 0 and taskStatus.save_as_template
				hrtool.actions.insertNewTemplate @templateModel,
					title: title,
					description: description,
					id_team: template_team,
					id_department: template_department
	
			hrtool.actions.insertNewTask @taskModel,
				title: title
				description: description
				id_team: team
				id_department: department
				id_user: userStatus.user.id
				id_buddy: @_buddyDropdown.selected.id
				date_from: @_dateInput.value
				date_to: dateTo

			@clearInputs();
		return



	clearInputs: () ->
		@_lengthInput.value = ''
		@_dateInput.value = @helper.format.getDateInputFormat new Date()
		@_componentFilter.unselectAll()
		@_buddyDropdown.setSelection ComponentDropdown.EmptyOption

		@_leftComponent._title.value = ''
		@_leftComponent._text.value = ''
		@_leftComponent._saveAsNew.setChecked false
		@_leftComponent._filter.unselectAll()
		@_leftComponent._filter.setActive false
		@_rightComponent._componentFilter.unselectAll()
		return


	checkInputs: (userStatus, taskStatus, dateFrom, length, selectedTab) -> 
		ret = true;
		date = new Date();
		today = new Date date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0
	
		if userStatus.department.id is -1
			@addNotification 'User department wasn\'t picked!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error
			@_componentFilter._dropdowns[0].setInvalidInputClass()
			ret = false
	
		if userStatus.team.id is -1
			@addNotification 'User team wasn\'t picked!',ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error
			@_componentFilter._dropdowns[1].setInvalidInputClass() if @_componentFilter._dropdowns[1].getIsEnabled()
			ret = false
	
		if userStatus.user.id is -1
			@addNotification 'User wasn\'t picked!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error
			@_componentFilter._dropdowns[2].setInvalidInputClass() if @_componentFilter._dropdowns[2].getIsEnabled()
			ret = false
	
		if @_buddyDropdown.selected.id is -1
			@addNotification 'Task buddy wasn\' picked!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error
			@_buddyDropdown.setInvalidInputClass()
			ret = false
	
		if userStatus.user.id isnt -1 and (userStatus.user.id is @_buddyDropdown.selected.id)
			@addNotification 'User and task buddy cannot be the same person!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error
			@_componentFilter._dropdowns[2].setInvalidInputClass()
			@_buddyDropdown.setInvalidInputClass()
			ret = false

		if dateFrom.toString() is 'Invalid Date' or dateFrom.getTime() < today.getTime()
			@addNotification 'Date wasn\'t fill correctly!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error
			@setInvalidInputClass @_dateInput
			ret = false
	
		if not Number(length)
			@addNotification 'Length of new task has to be number!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error
			@setInvalidInputClass @_lengthInput
			ret = false
	
		if selectedTab is 0
			if taskStatus.title is ''
				@addNotification 'Title of new task has to be filled in!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error
				@setInvalidInputClass @_leftComponent._title
				ret = false

			if taskStatus.description is ''
				@addNotification 'Description of new task has to be filled in!',ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error
				@setInvalidInputClass @_leftComponent._text
				ret = false

			if taskStatus.save_as_template and taskStatus.department_id is -1
				@addNotification 'Task department wasn\'t picked!',	ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error
				@_leftComponent._filter._dropdowns[0].setInvalidInputClass()
				ret = false

			if taskStatus.save_as_template and taskStatus.department_id is -1
				@addNotification 'Task team wasn\'t picked!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error
				@_leftComponent._filter._dropdowns[1].setInvalidInputClass()
				ret = false
	
		if selectedTab is 1
			if taskStatus.task_template.id is -1
				@addNotification 'Template wasn\'t picked correctly!', ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.EventType.error
				@_rightComponent._componentFilter._dropdowns[2].setInvalidInputClass()
				ret = false

		return ret;


	handleClickEvent: (event) =>
		type = event.target.type;
		if type  in ['text', 'textarea', 'number', 'date']
			if ComponentBase.INVALID_INPUT_CLASS in event.target.classList
				event.target.classList.remove ComponentBase.INVALID_INPUT_CLASS
		return

	handleDropdownChange: (selection) =>
		switch selection.value
			when @_componentFilter._dropdowns[0].selected.value
				dropdown = @_leftComponent._filter._dropdowns[0]
			when @_componentFilter._dropdowns[1].selected.value
				dropdown = @_leftComponent._filter._dropdowns[1]
			else return
		
		for item in dropdown._map
			if item.value.value is selection.value
				dropdown.setSelection item.value
		@_leftComponent._filter.setActive @_leftComponent._saveAsNew.checked
		return

ComponentAddTask.WRAPPER_CLASS = 'new-task-wrapper'
ComponentAddTask.PERSON_WRAPPER_CLASS = 'new-task-person-wrapper'
ComponentAddTask.BOTTOM_WRAPPER_CLASS = 'new-task-date-wrapper'
ComponentAddTask.NOTIFICATION_DURATION = 4000
ComponentAddTask.EventType =
	GET_USERS : 'user/get-all'
	INSERT_NEW_TEMPLATE: 'template/insert'
	INSERT_NEW_TASK: 'tasks/insert'
	SAVE_SUCCESS: 'save-success'
	SAVE_FAIL: 'save-fail'

module.exports = ComponentAddTask