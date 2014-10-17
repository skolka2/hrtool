ComponentBase = require './../../componentBase'
Model = require '../../../models/model'
ComponentFilter = require './../componentFilter'
hrtool = require '../../../models/actions'
helper = require '../../../helpers/helpers'
ComponentFilterFormatter = require './../componentFilterFormatter'
ComponentNotificationCenter = require './../../componentNotificationCenter'
ComponentLeftBase = require './newTask/componentLeftBase'
ComponentTaskImplicitFactory = './componentImplicitTaskFactory'

class ComponentTaskImplicit extends ComponentBase
	constructor: () ->
		super()
		@setFromTemplate = yes
		@data =
			id_task_template: ""
			id_department: null
			id_team: null
			title: ""

	createDom: () ->
		divsName = ComponentTaskImplicit.ListDivs
		@dropDownData = ComponentFilterFormatter.factory.createTeamDropdownsData helper.bulk.getData(['departments']), this.helper.bulk.getData(['teams'])
		dataMap = @_getSelectedItem @data, @dropDownData
		@dropdown = new ComponentFilter dataMap.dd, ['department', 'teams']
		@buddy_dropdown = new ComponentFilter dataMap.dd, ['department', 'teams']

		jadeTitle =
			wrapper:
				className: divsName.title
		jadeDaT =
			wrapper:
				className: divsName.department_team

		jadeBuddyDaT =
			wrapper:
				className: divsName.buddy_department_team

		jadeStart =
			wrapper:
				className: divsName.task_start
			data:
				className: "#{divsName.task_start} text"

		jadeLength =
			wrapper:
				className: divsName.task_length
			data:
				className: "#{divsName.task_length} text"

		jadeSave =
			wrapper:
				className: divsName.route

		jadeData =
			createNew: @setFromTemplate
			title: jadeTitle
			dAt: jadeDaT
			bDaT: jadeBuddyDaT
			start: jadeStart
			length: jadeLength
			save: jadeSave

		wrapper = helper.tpl.create "components/features/addTask/componentTaskImplicit", jadeData
		@element = wrapper
		#Create AddTask
		if not @setFromTemplate
			div = wrapper.getElementsByClassName(divsName.title)[0]
			@addTask.render div

		#Create Department and Team
		div = wrapper.getElementsByClassName(divsName.department_team)[0]
		@addChild divsName.department_team + @dropdown.componentId, @dropdown, {el: div}
		@dropdown.render div

		#Create buddy Department and Team
		div = wrapper.getElementsByClassName(divsName.buddy_department_team)[0];
		@addChild divsName.buddy_department_team + @dropdown.componentId, @buddy_dropdown, {el: div}
		@buddy_dropdown.render div

		#create task start at
		div = wrapper.getElementsByClassName(divsName.task_start)[0];
		div.addEventListener ComponentBase.eventType.ONKEYPRESS, (event) =>
			event.returnValue = helper.number.isNumber String.fromCharCode(event.keyCode), 1, ""

		#create task length
		div = wrapper.getElementsByClassName(divsName.task_length)[0];
		div.addEventListener ComponentBase.eventType.ONKEYPRESS, (event) =>
			event.returnValue = helper.number.isNumber String.fromCharCode(event.keyCode), 1, ""
		wrapper.addEventListener ComponentBase.eventType.CLICK, @handleOnClick

	_getSelectedItem: (data, dropDownData) ->
		map =
			data: data
			dd: JSON.parse JSON.stringify dropDownData #create copy of dropdown data, because multiple select....
		map.dd[0][""][@_getIdForSelected(map.dd[0][""], data.id_department)]["selected"] = "true"  if data.id_department?
		map.dd[1][data.id_department][@_getIdForSelected(map.dd[1][data.id_department], data.id_team)]["selected"] = "true"  if data.id_team?
		return map

	_getIdForSelected: (arr, key) ->
		for item, d in arr
			if arr[d].id == key
				return d
    return null

	handleOnClick: (ev) =>
		target = ev.target
		rowEl = helper.dom.getParentByClass target, "implicit-task"
		if rowEl
			objectData =
				object: target
				rowEl: rowEl
			if target.classList.contains "save"
				@handleButtonSave objectData
			else if target.classList.contains "length"
				@handleEditText objectData
			else if target.classList.contains "dropDownItem"
				rowEl.getElementsByClassName("save")[0].innerHTML = "Add"

	handleEditText: (data) ->
		data.object.focus()
		data.rowEl.getElementsByClassName("save")[0].innerHTML = "Add"

	handleButtonSave: (data) ->
		dropStatus = @dropdown.getStatus()
		dep = dropStatus["department"].id
		team = dropStatus["teams"].id
		buddyDropStatus = @buddy_dropdown.getStatus()
		buddyDep = buddyDropStatus["department"].id
		buddyTeam = buddyDropStatus["teams"].id
		lengthEl = data.rowEl.getElementsByClassName("#{ComponentTaskImplicit.ListDivs.task_length} text")[0]
		start = data.rowEl.getElementsByClassName("#{ComponentTaskImplicit.ListDivs.task_start} text")[0]
		error = no
		unless @setFromTemplate
			taskStatus = @addTask.getStatus()
			if taskStatus.description is ''
				@addNotification 'Description of new task has to be filled in!',ComponentTaskImplicit.NOTIFICATION_DURATION, ComponentNotificationCenter.eventType.error
				@setInvalidInputClass @addTask._text
				error = yes
		if dep is -1
			@addNotification 'Department must be filled in!', ComponentTaskImplicit.NOTIFICATION_DURATION, ComponentNotificationCenter.eventType.error
			@dropdown.setInvalidInputClass()
			error = yes
		if buddyDep is -1
			@addNotification 'Buddy department must be filled in!', ComponentTaskImplicit.NOTIFICATION_DURATION, ComponentNotificationCenter.eventType.error
			@buddy_dropdown.setInvalidInputClass()
			error = yes
		if @data.title is ''
			@addNotification 'Title of new task has to be filled in!', ComponentTaskImplicit.NOTIFICATION_DURATION, ComponentNotificationCenter.eventType.error
			@setInvalidInputClass @addTask._title unless @setFromTemplate
			error = yes

		if lengthEl.value == ""
			@addNotification "Length of implicit task must me a number", ComponentTaskImplicit.NOTIFICATION_DURATION, ComponentNotificationCenter.eventType.error
			@setInvalidInputClass lengthEl
			error = yes
		if start.value == ""
			@addNotification "start day of implicit task must me a number", ComponentTaskImplicit.NOTIFICATION_DURATION, ComponentNotificationCenter.eventType.error
			@setInvalidInputClass start
			error = yes
		if not error
			data.object.innerHTML = "Saving";

			saveData =
				id_task_template: this.data.id_task_template
				id_team: null
				id_department: null
				start_day:parseInt start.value
				duration: parseInt lengthEl.value
				id_department_role: helper.bulk.getData ["user","id_department_role"]
				id_buddy_department: null
				id_buddy_team: null
			saveData["id_department"] = dep  unless dep is -1
			saveData["id_team"] = team  unless team is -1
			saveData["id_buddy_department"] = buddyDep  unless buddyDep is -1
			saveData["id_buddy_team"] = buddyTeam  unless buddyTeam is -1
			saveData["title"] = taskStatus.title  if taskStatus? and taskStatus.title isnt ""
			saveData["description"] = taskStatus.description  if taskStatus? and taskStatus.description isnt ""
			start.value = ""
			lengthEl.value = ""
			saveModel = new Model ComponentTaskImplicit.eventType.DATA_ADD
			console.log saveData
			@listen ComponentTaskImplicit.eventType.DATA_ADD, saveModel, () =>
				@onSave @, data.object
			hrtool.actions.saveImplicitTaskData saveModel, saveData

	onSave: (objEl, data) ->
		if data.error
			@addNotification "Critical error! Please contact administrator!", ComponentTaskImplicit.NOTIFICATION_DURATION, ComponentNotificationCenter.eventType.error
		else
			objEl.element.getElementsByClassName("save")[0].innerHTML = "Add"
			@addNotification "Implicit task has been successfully added.", ComponentTaskImplicit.NOTIFICATION_DURATION, ComponentNotificationCenter.eventType.success

	handleChangedTemplateDataForImplicit: (data) ->
		@data.id_task_template = data.task_template.id
		@data.title = data.task_template.value
		console.log @data

	setAsNew: () ->
		@setFromTemplate = no
		@addTask = new ComponentLeftBase()
		@data =
			id_task_template: null
			id_department: null
			id_team: null
			title: ""


ComponentTaskImplicit.ListDivs =
	title: "title"
	department_team: "department-and-team"
	buddy_department_team: "buddy_department-and-team"
	task_start: "start"
	task_length: "length"
	route: "route"

ComponentTaskImplicit.eventType =
	DATA_ADD: 'implicit/add'
ComponentTaskImplicit.NOTIFICATION_DURATION = 3000
module.exports = ComponentTaskImplicit