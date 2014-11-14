ComponentBase = require "../../../componentBase"
ComponentFilterFormatter = require "../../componentFilterFormatter"
ComponentFilter = require "../../componentFilter"
ComponentLeftBase = require "../componentLeftBase"
ComponentRight = require "../newTask/componentRight"
ComponentContentSwitcher = require "../../componentContentSwitcher"
ComponentCheckBox = require "../../componentCheckBox"
ComponentDropdown = require "../../componentDropdown"
Model = require "../../../../models/model"
NotificationCenter = require "../../../componentNotificationCenter"
hrtool = require "../../../../models/actions"
app = require "../../../../app"

class ComponentAddImplicitTask extends ComponentBase
	constructor: () ->
		super()
		dropData = ComponentFilterFormatter.factory.createTeamDropdownsData app?.bulk?.departments, app?.bulk?.teams
		@_filter = new ComponentFilter dropData, ['department', 'team']
		@_filter2 = new ComponentFilter dropData, ['department', 'team']
		@listen ComponentDropdown.eventType.CHANGE, @_filter, @handleDropdownChange

		dropData = {}
		for role in app?.bulk?.departmentRoles
			dropData[role.id_department_role] = role
		dropData = ComponentFilterFormatter.transform dropData, "id_department_role", "title"
		@_roleDropdown = new ComponentDropdown dropData[''], yes

		@taskModel = new Model ComponentAddImplicitTask.eventType.SAVE_IMPLICIT_TASK
		@listen ComponentAddImplicitTask.eventType.SAVE_IMPLICIT_TASK, @taskModel, @onSave

		@templateModel = new Model ComponentAddImplicitTask.eventType.SAVE_IMPLICIT_TEMPLATE
		@listen ComponentAddImplicitTask.eventType.SAVE_IMPLICIT_TEMPLATE, @templateModel, @onTemplateSave



	createDom: () ->
		jadeData =
			wrapperClass: ComponentAddImplicitTask.classes.WRAPPER
			contentSwitcherDiv: ComponentAddImplicitTask.classes.CONTENT_SWITCHER_DIV
			bottomWrapperClass: ComponentAddImplicitTask.classes.BOTTOM
			selectorsDiv: ComponentAddImplicitTask.classes.SELECTORS
			startInputClass: ComponentAddImplicitTask.classes.START_INPUT
			taskLengthInputClass: ComponentAddImplicitTask.classes.TASK_LENGTH_INPUT
			saveButtonClass: ComponentAddImplicitTask.classes.SAVE_BUTTON
		@element = @helper.tpl.create 'components/features/addTask/newImplicitTask/componentAddImplicitTask', jadeData

		switcherDiv = @element.getElementsByClassName(ComponentAddImplicitTask.classes.CONTENT_SWITCHER_DIV)[0]
		@componentLeftBase = new ComponentLeftBase()
		@componentRight = new ComponentRight()
		@contentSwitcher = new ComponentContentSwitcher ["New Implicit Task", "Choose a template"], [[@componentLeftBase], [@componentRight]]
		@addChild 'contentSwitcher', @contentSwitcher, {el: switcherDiv}
		@contentSwitcher.render switcherDiv

		selectorsDiv = @element.getElementsByClassName(ComponentAddImplicitTask.classes.SELECTORS)[0]
		@addChild "filter1", @_filter, {el: selectorsDiv}
		@_filter.render selectorsDiv

		@addChild "filter2", @_filter2, {el: selectorsDiv}
		@_filter2.render selectorsDiv

		@addChild "roleDropdown", @_roleDropdown, {el: selectorsDiv}
		@_roleDropdown.render selectorsDiv


		@saveButton = @element.getElementsByClassName(ComponentAddImplicitTask.classes.SAVE_BUTTON)[0]
		@saveButton.addEventListener ComponentBase.eventType.CLICK, @handleSaveClickEvent

		@startInput = @element.getElementsByClassName(ComponentAddImplicitTask.classes.START_INPUT)[0]
		@durationInput = @element.getElementsByClassName(ComponentAddImplicitTask.classes.TASK_LENGTH_INPUT)[0]
		return




	handleDropdownChange: (selection) =>
		switch selection.value
			when @_filter._dropdowns[0].selected.value
				dropdown = @_filter2._dropdowns[0]
			when @_filter._dropdowns[1].selected.value
				dropdown = @_filter2._dropdowns[1]
			else return

		for item in dropdown._map
			if item.value.value is selection.value
				dropdown.setSelection item.value
				break;
		return




	handleSetAsImplicitChanged: (data) =>
		@_filter2.setActive data
		@fire ComponentBase.eventType.CHANGE, @_filter2.getStatus()
		return




	onTemplateSave: (template) =>
		status = @_filter.getStatus()
		status2 = @_filter2.getStatus()
		hrtool.actions.saveImplicitTaskData @taskModel,
			start_day: @startInput.value
			duration: @durationInput.value
			id_task_template: template.id_task_template
			id_team: if status.team.id is -1 then null else status.team.id
			id_department: if status.department.id is -1 then null else status.department.id
			id_department_role: if @_roleDropdown.getSelection().id is -1 then null else @_roleDropdown.getSelection().id
			id_buddy_team: if status2.team.id is -1 then null else status2.team.id
			id_buddy_department: if status2.department.id is -1 then null else status2.department.id
		return





	onSave: (data) =>
		if data?.name? isnt 'error'
			@addNotification ComponentAddImplicitTask.messages.SAVE_SUCCESS, NotificationCenter.DEFAULT_TIME, NotificationCenter.eventType.SUCCESS
			@fire ComponentAddImplicitTask.eventType.SAVE_SUCCESS, null
			@clearInputs()
		else
			@addNotification ComponentAddImplicitTask.messages.SAVE_ERROR, NotificationCenter.DEFAULT_TIME, NotificationCenter.eventType.ERROR
			@fire ComponentAddImplicitTask.eventType.SAVE_ERROR, null
		return


	handleSaveClickEvent: () =>
		selectedTab = @contentSwitcher.getSelectedTabNumber()
		taskStatus = if selectedTab is 0 then @componentLeftBase.getStatus() else @componentRight.getStatus()
		start = @startInput.value
		length = @durationInput.value

		if @checkInputs(taskStatus, start, length, selectedTab) is yes
			switch selectedTab
				when 0    #new implicit task is inserted
					status = @_filter.getStatus()
					title = taskStatus.title
					description = taskStatus.description
					template_team = if status.team.id is -1 then null else status.team.id
					template_department = if status.department.id is -1 then null else status.department.id

					hrtool.actions.insertNewTemplate @templateModel,
						title: title,
						description: description,
						id_team: if template_team is -1 then null else template_team
						id_department: if template_department is -1 then null else template_department

				when 1    #task template is chosen
					template = @componentRight.getSelectedTemplate(taskStatus.task_template.id)
					hrtool.actions.saveImplicitTaskData @taskModel,
						start_day: @startInput.value
						duration: @durationInput.value
						id_task_template: template.id_task_template
						id_team: template.id_team
						id_department: template.id_department
						id_department_role: template.id_department_role
						id_buddy_team: template.id_buddy_team
						id_buddy_department: template.id_buddy_department

		return



	checkInputs: (taskStatus, start, length, selectedTab) ->
		ret = true
		if selectedTab is 0
			if taskStatus.title.length <= 0
				@addNotification ComponentAddImplicitTask.messages.NO_TASK_TITLE, NotificationCenter.DEFAULT_TIME, NotificationCenter.eventType.ERROR
				@setInvalidInputClass @componentLeftBase._title
				ret = false
			if taskStatus.description.length <= 0
				@addNotification ComponentAddImplicitTask.messages.NO_TASK_DESCRIPTION, NotificationCenter.DEFAULT_TIME, NotificationCenter.eventType.ERROR
				@setInvalidInputClass @componentLeftBase._text
				ret = false
		else
			if taskStatus.task_template.id is -1
				@addNotification ComponentAddImplicitTask.messages.NO_TEMPLATE, NotificationCenter.DEFAULT_TIME, NotificationCenter.eventType.ERROR
				@componentRight._componentFilter._dropdowns[2].setInvalidInputClass()
				ret = false

		if not Number(start)
			@addNotification ComponentAddImplicitTask.messages.WRONG_TASK_START, NotificationCenter.DEFAULT_TIME, NotificationCenter.eventType.ERROR
			@setInvalidInputClass @startInput
			ret = false

		if not Number(length)
			@addNotification ComponentAddImplicitTask.messages.WRONG_TASK_LENGTH, NotificationCenter.DEFAULT_TIME, NotificationCenter.eventType.ERROR
			@setInvalidInputClass @durationInput
			ret = false

		return ret






	clearInputs: () ->
		@durationInput.value = ''
		@startInput.value = ''
		@componentLeftBase._title.value = ''
		@componentLeftBase._text.value = ''
		@_filter.unselectAll()
		@_filter2.unselectAll()
		@_roleDropdown.setSelection ComponentDropdown.EmptyOption
		@componentRight._componentFilter.unselectAll()
		return




ComponentAddImplicitTask.eventType =
	SAVE_ERROR: "implicit-task-save-error"
	SAVE_SUCCESS: "implicit-task-save-success"
	SAVE_IMPLICIT_TASK: "tasks/implicit/insert"
	SAVE_IMPLICIT_TEMPLATE: "template/insert"


ComponentAddImplicitTask.messages =
	SAVE_ERROR: "Somenthing went wrong during saving"
	SAVE_SUCCESS: "Saving success"
	WRONG_TASK_LENGTH: 'Length of new task has to be number!'
	WRONG_TASK_START: 'Start of task has to be number!'
	NO_TASK_TITLE: 'Title of new task has to be filled in!'
	NO_TASK_DESCRIPTION: 'Description of new task has to be filled in!'
	NO_TEMPLATE: 'Template wasn\'t picked correctly!'
	NO_DEPARTMENT: "Department has to be picked!"
	NO_BUDDY_DEPARTMENT: "Department of a buddy has to be picked!"
	NO_TEAM: "Team has to be picked!"
	NO_BUDDY_TEAM: "Team of a buddy has to be picked!"

ComponentAddImplicitTask.classes =
	WRAPPER: 'add-implicit-task'
	CONTENT_SWITCHER_DIV: 'content-switcher-div'
	SELECTORS: 'selectors'
	BOTTOM: 'bottom-wrapper'
	START_INPUT: 'start-input'
	TASK_LENGTH_INPUT: 'task-lenght-input'
	SAVE_BUTTON: 'save-button'

module.exports = ComponentAddImplicitTask