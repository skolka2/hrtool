ComponentBase = require '../../../componentBase' 
ComponentLeft = require './componentLeft'
ComponentRight = require './componentRight' 
ComponentContentSwitcher = require '../../componentContentSwitcher'
ComponentFilterFormatter = require '../../componentFilterFormatter' 
ComponentFilter = require '../../componentFilter' 
ComponentDropdown = require '../../componentDropdown' 
Model = require '../../../../models/model' 
hrtool = require '../../../../models/actions' 
Const = require '../../../../helpers/constants' 
NotificationCenter = require '../../../componentNotificationCenter' 


class ComponentAddTask extends ComponentBase
	constructor: (@_preselectedUserId) ->
		super()
		@_leftComponent = new ComponentLeft();
		@_rightComponent = new ComponentRight();
		@_tabbedAreaComponent = new ComponentContentSwitcher ['New task', 'Choose template'],[[@_leftComponent], [@_rightComponent]]

		@setModel new Model(ComponentAddTask.eventType.GET_USERS), ComponentAddTask.eventType.GET_USERS
		hrtool.actions.getUsers @model

		@taskModel = new Model ComponentAddTask.eventType.INSERT_NEW_TASK
		@listen ComponentAddTask.eventType.INSERT_NEW_TASK, @taskModel, @onSave

		@templateModel = new Model ComponentAddTask.eventType.INSERT_NEW_TEMPLATE


	onLoad: (data) ->
		departments = @helper.bulk.getDepartmentData();
		teams = @helper.bulk.getTeamData();
		users = {};
		buddies = {};

		for item in data
			buddies[item.id_user] =
				id_user : item.id_user
				full_name: item.first_name+' '+item.last_name
			for team in item.teams
				users[item.id_user + '-' +team]=
					id_user : item.id_user
					full_name: item.first_name+' '+item.last_name
					id_team : team
					id_department : teams[team].id_department



		data2 = ComponentFilterFormatter.factory.createUsersDropdownsData departments, teams, users
		@_componentFilter = new ComponentFilter data2, ['department', 'team', 'user'], [false, false, true]
		@addChild 'componentFilter', @_componentFilter, {el: @_personWrapper}
		@_componentFilter.render @_personWrapper
		@listen ComponentDropdown.eventType.CHANGE, @_componentFilter, @handleDropdownChange
	
		buddies2 = ComponentFilterFormatter.transform buddies, 'id_user', 'full_name'
		@_buddyDropdown = new ComponentDropdown buddies2[''], true
		@addChild 'buddyDropdown', @_buddyDropdown, {el: @_personWrapper}
		@_buddyDropdown.render @_personWrapper

		if @_preselectedUserId?
			teamsModel = new Model ComponentAddTask.eventType.GET_USER_TEAMS
			@listen ComponentAddTask.eventType.GET_USER_TEAMS, teamsModel, @onTeamsLoad
			hrtool.actions.getBasicUserInfo(teamsModel, {
				id_user: @_preselectedUserId
			});

		return


	onTeamsLoad: (data) =>
		@_componentFilter.selectItems([data.id_department, data.id_team, @_preselectedUserId])
		return

	onSave: (data) ->
		if data.name? is 'error'
			@addNotification "Something messed up during saving!\n error code: #{data.code?}",
				ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@fire ComponentAddTask.eventType.SAVE_FAIL, null
		else
			@addNotification 'Saving was successful!', ComponentAddTask.NOTIFICATION_DURATION,
				NotificationCenter.eventType.SUCCESS
			@fire ComponentAddTask.eventType.SAVE_SUCCESS, null
		return


	createDom: () ->
		today = @helper.format.getDateInputFormat new Date()
		jadeData =
			today: today
			dateInputClass: @componentId + '-date-input'
			taskLengthInputClass: @componentId + '-length-input'
			saveButtonClass: @componentId + '-save-button'
			wrapperClass: ComponentAddTask.classes.WRAPPER_CLASS
			personWrapperClass: ComponentAddTask.classes.PERSON_WRAPPER_CLASS
			bottomWrapperClass: ComponentAddTask.classes.BOTTOM_WRAPPER_CLASS
	
		@element = @helper.tpl.create 'components/features/addTask/newTask/componentAddTask', jadeData
		@_personWrapper = @element.getElementsByClassName(ComponentAddTask.classes.PERSON_WRAPPER_CLASS)[0]
		@_lengthInput = @element.getElementsByClassName(jadeData.taskLengthInputClass)[0];
		@_dateInput = @element.getElementsByClassName(jadeData.dateInputClass)[0];
		bottomDiv = @element.getElementsByClassName(ComponentAddTask.classes.BOTTOM_WRAPPER_CLASS)[0];
	
		tabbedAreaDiv = document.createElement 'div'
		@element.insertBefore tabbedAreaDiv, bottomDiv
		@addChild 'tabbedArea', @_tabbedAreaComponent, {el: tabbedAreaDiv}
	
		@saveButton = @element.getElementsByClassName(jadeData.saveButtonClass)[0]
		@saveButton.addEventListener ComponentBase.eventType.CLICK, @handleSaveClickEvent, false
	
		@element.addEventListener ComponentBase.eventType.CLICK, @handleClickEvent, false
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
			@addNotification ComponentAddTask.messages.NO_DEPARTMENT, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@_componentFilter._dropdowns[0].setInvalidInputClass()
			ret = false
	
		if userStatus.team.id is -1
			@addNotification ComponentAddTask.messages.NO_TEAM,ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@_componentFilter._dropdowns[1].setInvalidInputClass() if @_componentFilter._dropdowns[1].getIsEnabled()
			ret = false
	
		if userStatus.user.id is -1
			@addNotification ComponentAddTask.messages.NO_USER, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@_componentFilter._dropdowns[2].setInvalidInputClass() if @_componentFilter._dropdowns[2].getIsEnabled()
			ret = false
	
		if @_buddyDropdown.selected.id is -1
			@addNotification ComponentAddTask.messages.NO_BUDDY, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@_buddyDropdown.setInvalidInputClass()
			ret = false
	
		if userStatus.user.id isnt -1 and (userStatus.user.id is @_buddyDropdown.selected.id)
			@addNotification ComponentAddTask.messages.SAME_BUDDY_AND_USER, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@_componentFilter._dropdowns[2].setInvalidInputClass()
			@_buddyDropdown.setInvalidInputClass()
			ret = false

		if dateFrom.toString() is 'Invalid Date' or dateFrom.getTime() < today.getTime()
			@addNotification ComponentAddTask.messages.WRONG_DATE, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@setInvalidInputClass @_dateInput
			ret = false
	
		if not Number(length)
			@addNotification ComponentAddTask.messages.WRONG_TASK_LENGTH, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@setInvalidInputClass @_lengthInput
			ret = false
	
		if selectedTab is 0
			if taskStatus.title is ''
				@addNotification ComponentAddTask.messages.NO_TASK_TITLE, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
				@setInvalidInputClass @_leftComponent._title
				ret = false

			if taskStatus.description is ''
				@addNotification ComponentAddTask.messages.NO_TASK_DESCRIPTION,ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
				@setInvalidInputClass @_leftComponent._text
				ret = false

			if taskStatus.save_as_template and taskStatus.department_id is -1
				@addNotification ComponentAddTask.messages.NO_TASK_DEPARTMENT, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
				@_leftComponent._filter._dropdowns[0].setInvalidInputClass()
				ret = false

			if taskStatus.save_as_template and taskStatus.department_id is -1
				@addNotification ComponentAddTask.messages.NO_TASK_TEAM, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
				@_leftComponent._filter._dropdowns[1].setInvalidInputClass()
				ret = false
	
		if selectedTab is 1
			if taskStatus.task_template.id is -1
				@addNotification ComponentAddTask.messages.NO_TEMPLATE, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
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

ComponentAddTask.messages =
	NO_DEPARTMENT: 'User department wasn\'t picked!'
	NO_TEAM: 'User team wasn\'t picked!'
	NO_USER: 'User wasn\'t picked!'
	NO_BUDDY: 'Task buddy wasn\' picked!'
	SAME_BUDDY_AND_USER: 'User and task buddy cannot be the same person!'
	WRONG_DATE: 'Date wasn\'t fill correctly!'
	WRONG_TASK_LENGTH: 'Length of new task has to be number!'
	NO_TASK_TITLE: 'Title of new task has to be filled in!'
	NO_TASK_DESCRIPTION: 'Description of new task has to be filled in!'
	NO_TASK_DEPARTMENT: 'Task department wasn\'t picked!'
	NO_TASK_TEAM: 'Task team wasn\'t picked!'
	NO_TEMPLATE: 'Template wasn\'t picked correctly!'

ComponentAddTask.classes =
	WRAPPER_CLASS: 'new-task-wrapper'
	PERSON_WRAPPER_CLASS: 'new-task-person-wrapper'
	BOTTOM_WRAPPER_CLASS: 'new-task-date-wrapper'

ComponentAddTask.NOTIFICATION_DURATION = 4000

ComponentAddTask.eventType =
	GET_USERS : 'user/get-all'
	GET_USER_TEAMS: 'user/get-basic-info'
	INSERT_NEW_TEMPLATE: 'template/insert'
	INSERT_NEW_TASK: 'tasks/insert'
	SAVE_SUCCESS: 'save-success'
	SAVE_FAIL: 'save-fail'

module.exports = ComponentAddTask