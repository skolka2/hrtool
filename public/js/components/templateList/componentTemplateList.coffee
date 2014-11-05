ComponentBase = require './../componentBase'
Model = require '../../models/model'
ComponentFilter = require './../features/componentFilter'
helper = require '../../helpers/helpers'
ComponentFilterFormatter = require './../features/componentFilterFormatter'
hrtool = require '../../models/actions'
ComponentNotificationCenter = require './../componentNotificationCenter'


class ComponentTemplateList extends ComponentBase
	constructor: () ->
		super()
		@data = null
		@dropdowns = {}



	createDom: () ->
		wrapper = document.createElement 'div'
		wrapper.className = "template-list"
		wrapper.innerHTML = "Loading... Please wait"
		@element = wrapper



	onLoad: (data) ->
		@element.innerHTML = ""
		@data = data
		dropDownData = ComponentFilterFormatter.factory.createTeamDropdownsData @helper.bulk.getData(['departments']), @helper.bulk.getData(['teams'])

		jadeHeaderData =
			header: yes,
			data:
				items: ComponentTemplateList.TemplateListDivs

		jadeHeader = helper.tpl.create "components/templateList/componentTemplateList", jadeHeaderData
		@getElement().appendChild jadeHeader
		@getElement().addEventListener ComponentBase.eventType.CLICK, @handleOnClick

		for item in data
			dataMap = @_getSelectedItem item, dropDownData
			@addRow dataMap
		return


	addRow: (data) ->
		id = data.data.id_task_template
		divsName = ComponentTemplateList.TemplateListDivs
		dropdown = new ComponentFilter data.dd, ['department', 'teams']
		@dropdowns[id] = dropdown
		jadeRow =
			wrapper:
				className: "row"
				atribut: id
	
		jadeTitle =
			wrapper:
				className: divsName.title
			data:
				className: divsName.title + " text"
				value: data.data[divsName.title]
	
		jadeDesc =
			wrapper:
				className: divsName.description
			data:
				className: divsName.description + " text"
				value: data.data[divsName.description]

		jadeDaT =
			wrapper:
				className: divsName.id_department

		jadeSave =
			wrapper:
				className: divsName.route

		jadeDelete =
			data:
				implicit: !!data.data.implicit
	
		jadeData =
			row: jadeRow
			title: jadeTitle
			desc: jadeDesc
			dAt: jadeDaT
			save: jadeSave
			bdelete: jadeDelete
	
		jadeTask = helper.tpl.create "components/templateList/componentTemplateList", jadeData
		@getElement().appendChild jadeTask

		div = jadeTask.getElementsByClassName(divsName.id_department)[0]
		@addChild divsName.id_department + dropdown.componentId, dropdown, {el: div}
		dropdown.render div
		return jadeTask




	_getSelectedItem: (data, dropDownData) ->
		map =
			data: data
			dd: JSON.parse JSON.stringify(dropDownData)

		if data.id_department
			map.dd[0][""][@_getIdForSelected(map.dd[0][""], data.id_department)]['selected'] = "true"

		if data.id_team
			map.dd[1][data.id_department][@_getIdForSelected(map.dd[1][data.id_department], data.id_team)]['selected'] = "true"
		return map

	_getIdForSelected: (arr, key) ->
		return i for item, i in arr when item.id is key
		return null


	handleOnClick: (ev) =>
		target = ev.target
		rowEl = helper.dom.getParentByClass(target, "row")
		if rowEl
			id = rowEl.getAttribute "data-template-id"
			objectData =
				object: target
				id: id
				rowEl: rowEl
			if target.classList.contains "delete"
				@handleButtonDelete objectData
			else if target.classList.contains "save"
				@handleButtonSave objectData
			else if target.classList.contains "title"
				@handleEditText objectData
			else if target.classList.contains "description"
				@handleEditText objectData
			else if target.classList.contains "dropDownItem"
				rowEl.getElementsByClassName("save")[0].innerHTML = "Save"
		return



	handleEditText: (data) ->
		data.rowEl.getElementsByClassName("save")[0].innerHTML = "Save"



	handleButtonSave: (data) ->
		titleEl = data.rowEl.getElementsByClassName(ComponentTemplateList.TemplateListDivs.title + " text")[0]
		descEl = data.rowEl.getElementsByClassName(ComponentTemplateList.TemplateListDivs.description + " text")[0]
		dropStatus = @dropdowns[data.id].getStatus()
		error = no
		if titleEl.value is ""
			error = yes
			newDiv = document.createElement 'div'
			newDiv.innerHTML = "Title must not be empty!"
			@setInvalidInputClass titleEl
			@addNotification newDiv, 3000, ComponentNotificationCenter.eventType.error
		unless error
			data.object.innerHTML = "Saving"
			dep = dropStatus["department"].id
			team = dropStatus["teams"].id
			saveData =
				title: titleEl.value
				id_task_template: parseInt data.id
				description: descEl.value
				id_team: null
				id_department: null
			if dep isnt "-1"
				saveData['id_department'] = dep
			if team isnt "-1"
				saveData['id_team'] = team
			saveModel = new Model ComponentTemplateList.eventType.DATA_SAVE
			@listen ComponentTemplateList.eventType.DATA_SAVE, saveModel, (backendData) =>
				@onSave data.object, backendData
			hrtool.actions.saveDefaultTaskData saveModel, saveData
		return


	handleButtonDelete: (data) ->
		if data.object.getAttribute("implicit") is "true"
			newDiv = document.createElement 'div'
			newDiv.innerHTML = "Implicit task cannot be deleted"
			@addNotification newDiv, 3000, ComponentNotificationCenter.eventType.error
		else
			deleteModel = new Model ComponentTemplateList.eventType.DATA_DELETE
			@listen ComponentTemplateList.eventType.DATA_DELETE, deleteModel, (backendData) =>
				@onDelete data.object, backendData
			hrtool.actions.deleteDefaultTaskData deleteModel, {id_task_template: parseInt(data.id)}




	onSave: (objEl, data) =>
		if data.name and data.name is 'error'
			objEl.disabled = no
			newDiv = document.createElement 'div'
			newDiv.innerHTML = "Critical error! Please contact your administrator!"
			@addNotification newDiv, 3000, ComponentNotificationCenter.eventType.error
		else
			objEl.innerHTML = "Save"
			newDiv = document.createElement 'div'
			newDiv.innerHTML = "Task has been successfuly saved."
			@addNotification newDiv, 3000, ComponentNotificationCenter.eventType.success
		return



	onDelete: (objEl, data) =>
		if data.name and data.name is 'error'
			objEl.disabled = no
			newDiv = document.createElement 'div'
			newDiv.innerHTML = "Critical error! Please contact your administrator!"
			@addNotification newDiv, 3000, ComponentNotificationCenter.eventType.error
		else
			document.body.removeEventListener ComponentBase.eventType.CLICK, @onDelete, no
			@dropdowns[data[0].id_task_template].destroy()
			rowEl = helper.dom.getParentByClass objEl, "row"
			rowEl.innerHTML = ""
			newDiv = document.createElement 'div'
			newDiv.innerHTML = "Task has been successfuly deleted."
			@addNotification newDiv, 3000, ComponentNotificationCenter.eventType.success
		return



ComponentTemplateList.TemplateListDivs =
	title: "title"
	description: "description"
	id_department: "department-and-team"
	route: "route"

ComponentTemplateList.eventType =
	DATA_LOAD: 'template/get-all'
	DATA_SAVE: 'template/update'
	DATA_DELETE: 'template/delete'

module.exports = ComponentTemplateList