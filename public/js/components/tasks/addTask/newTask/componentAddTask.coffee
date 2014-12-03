ComponentBase = require '../../../componentBase' 
ComponentLeft = require './componentLeft'
ComponentRight = require './componentRight' 
ComponentContentSwitcher = require '../../../features/componentContentSwitcher'
ComponentFilterFormatter = require '../../../features/componentFilterFormatter'
ComponentFilter = require '../../../features/componentFilter'
ComponentDropdown = require '../../../features/componentDropdown'
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
			buddies[item.id_user] = item
			users[item.unique_id] = item

		data2 = ComponentFilterFormatter.factory.createUsersDropdownsData departments, teams, users
		@_componentFilter = new ComponentFilter data2, ['department', 'team', 'user'], [no, no, yes]
		@addChild 'componentFilter', @_componentFilter, {el: @_personWrapper}
		@_componentFilter.render @_personWrapper
		@listen ComponentDropdown.eventType.CHANGE, @_componentFilter, @handleDropdownChange
	
		buddies2 = ComponentFilterFormatter.transform buddies, 'id_user', 'full_name'
		@_buddyDropdown = new ComponentDropdown buddies2[''], yes
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
			@clearInputs();
		else
			@addNotification 'Saving was successful!', ComponentAddTask.NOTIFICATION_DURATION,
				NotificationCenter.eventType.SUCCESS
			@fire ComponentAddTask.eventType.SAVE_SUCCESS, null
		return


	createDom: ->
		today = @helper.format.getDateInputFormat new Date()
		jadeData =
			today: today
			dateInputClass: @componentId + '-date-input'
			taskLengthInputClass: @componentId + '-length-input'
			saveButtonClass: @componentId + '-save-button'
			wrapperClass: ComponentAddTask.classes.WRAPPER_CLASS
			personWrapperClass: ComponentAddTask.classes.PERSON_WRAPPER_CLASS
			bottomWrapperClass: ComponentAddTask.classes.BOTTOM_WRAPPER_CLASS
			contentSwitcherDiv: ComponentAddTask.classes.CONTENT_SWITCHER_DIV
	
		@element = @helper.tpl.create 'components/tasks/addTask/newTask/componentAddTask', jadeData
		@_personWrapper = @element.getElementsByClassName(ComponentAddTask.classes.PERSON_WRAPPER_CLASS)[0]
		@_lengthInput = @element.getElementsByClassName(jadeData.taskLengthInputClass)[0];
		@_dateInput = @element.getElementsByClassName(jadeData.dateInputClass)[0];
	
		tabbedAreaDiv = @element.getElementsByClassName(ComponentAddTask.classes.CONTENT_SWITCHER_DIV)[0]
		@addChild 'tabbedArea', @_tabbedAreaComponent, {el: tabbedAreaDiv}
	
		@saveButton = @element.getElementsByClassName(jadeData.saveButtonClass)[0]
		@saveButton.addEventListener ComponentBase.eventType.CLICK, @handleSaveClickEvent, no
	
		@element.addEventListener ComponentBase.eventType.CLICK, @handleClickEvent, no
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
		return



	clearInputs: ->
		@_lengthInput.value = ''
		@_dateInput.value = @helper.format.getDateInputFormat new Date()
		@_componentFilter.unselectAll()
		@_buddyDropdown.setSelection ComponentDropdown.EmptyOption

		@_leftComponent._titleEL.value = ''
		@_leftComponent._descriptionEl.value = ''
		@_leftComponent._saveAsNew.setChecked no
		@_leftComponent._filterTeam1.unselectAll()
		@_leftComponent._filterTeam1.setActive no
		@_rightComponent._componentFilter.unselectAll()
		return


	checkInputs: (userStatus, taskStatus, dateFrom, length, selectedTab) -> 
		ret = yes;
		date = new Date();
		today = new Date date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0
	
		if userStatus.department.id is -1
			@addNotification ComponentAddTask.messages.NO_DEPARTMENT, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@_componentFilter._dropdowns[0].setInvalidInputClass()
			ret = no
	
		if userStatus.team.id is -1
			@addNotification ComponentAddTask.messages.NO_TEAM,ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@_componentFilter._dropdowns[1].setInvalidInputClass() if @_componentFilter._dropdowns[1].getIsEnabled()
			ret = no
	
		if userStatus.user.id is -1
			@addNotification ComponentAddTask.messages.NO_USER, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@_componentFilter._dropdowns[2].setInvalidInputClass() if @_componentFilter._dropdowns[2].getIsEnabled()
			ret = no
	
		if @_buddyDropdown.selected.id is -1
			@addNotification ComponentAddTask.messages.NO_BUDDY, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@_buddyDropdown.setInvalidInputClass()
			ret = no
	
		if userStatus.user.id isnt -1 and (userStatus.user.id is @_buddyDropdown.selected.id)
			@addNotification ComponentAddTask.messages.SAME_BUDDY_AND_USER, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@_componentFilter._dropdowns[2].setInvalidInputClass()
			@_buddyDropdown.setInvalidInputClass()
			ret = no

		if dateFrom.toString() is 'Invalid Date' or dateFrom.getTime() < today.getTime()
			@addNotification ComponentAddTask.messages.WRONG_DATE, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@setInvalidInputClass @_dateInput
			ret = no
	
		if not Number(length)
			@addNotification ComponentAddTask.messages.WRONG_TASK_LENGTH, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
			@setInvalidInputClass @_lengthInput
			ret = no
	
		if selectedTab is 0
			if taskStatus.title is ''
				@addNotification ComponentAddTask.messages.NO_TASK_TITLE, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
				@setInvalidInputClass @_leftComponent._titleEL
				ret = no

			if taskStatus.description is ''
				@addNotification ComponentAddTask.messages.NO_TASK_DESCRIPTION,ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
				@setInvalidInputClass @_leftComponent._descriptionEl
				ret = no

			if taskStatus.save_as_template and taskStatus.department_id is -1
				@addNotification ComponentAddTask.messages.NO_TASK_DEPARTMENT, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
				@_leftComponent._filterTeam1._dropdowns[0].setInvalidInputClass()
				ret = no

			if taskStatus.save_as_template and taskStatus.department_id is -1
				@addNotification ComponentAddTask.messages.NO_TASK_TEAM, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
				@_leftComponent._filterTeam1._dropdowns[1].setInvalidInputClass()
				ret = no
	
		if selectedTab is 1
			if taskStatus.task_template.id is -1
				@addNotification ComponentAddTask.messages.NO_TEMPLATE, ComponentAddTask.NOTIFICATION_DURATION, NotificationCenter.eventType.ERROR
				@_rightComponent._componentFilter._dropdowns[2].setInvalidInputClass()
				ret = no

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
				dropdown = @_leftComponent._filterTeam1._dropdowns[0]
			when @_componentFilter._dropdowns[1].selected.value
				dropdown = @_leftComponent._filterTeam1._dropdowns[1]
			else return

		for item in dropdown.getMap()
			if item.value.value is selection.value
				dropdown.setSelection item.value
				break;
		@_leftComponent._filterTeam1.setActive @_leftComponent._saveAsNew.checked
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
	CONTENT_SWITCHER_DIV: 'content-switcher-div'

ComponentAddTask.NOTIFICATION_DURATION = 4000

ComponentAddTask.eventType =
	GET_USERS : 'user/get-all'
	GET_USER_TEAMS: 'user/get-basic-info'
	INSERT_NEW_TEMPLATE: 'template/insert'
	INSERT_NEW_TASK: 'tasks/insert'
	SAVE_SUCCESS: 'save-success'
	SAVE_FAIL: 'save-fail'

module.exports = ComponentAddTask