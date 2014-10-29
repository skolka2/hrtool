ViewBase =  require './viewBase'
ComponentFilterFormatter = require '../components/features/componentFilterFormatter'
ComponentFilter = require '../components/features/componentFilter'
ComponentTableWrapper = require '../components/table/componentTableWrapper'
ComponentTextInput = require '../components/features/componentTextInput'
ComponentTableFactory = require '../components/table/componentTableFactory'
ComponentTaskImplicit = require '../components/features/addTask/componentTaskImplicit'

class ViewImplicitTasks extends ViewBase
	constructor: ->
		super()

	render: ->
		super arguments
		mainWrapper = document.getElementById ViewBase.mainWrapper
		viewWrapper = document.createElement 'div'
		viewWrapper.className = "view-wraper"
		viewWrapper.innerHTML = "Implicit Tasks View"
		viewWrapper.appendChild document.createElement 'br'

		tableDiv = document.createElement 'div'
		tableDiv.innerHTML = "Table of implicit tasks"

		filterData = ComponentFilterFormatter.factory.createTeamDropdownsData @helper.bulk.getDepartmentData(), @helper.bulk.getTeamData()
		tasksTable = new ComponentTableWrapper ComponentTableFactory.implicitTable(), new ComponentFilter(filterData), new ComponentTextInput 'Type name'
		tasksTable.render tableDiv

		viewWrapper.appendChild tableDiv
		viewWrapper.appendChild document.createElement 'br'

		addTaskDiv = document.createElement 'div'
		addTaskDiv.innerHTML = "Form for adding new implicit task"

		dataForImplicit =
			id_task_template: 5
			id_department: 2
			id_team: 3
			title: "title example"

		componentTaskImplicit = new ComponentTaskImplicit dataForImplicit
		componentTaskImplicit.render addTaskDiv

		viewWrapper.appendChild addTaskDiv
		viewWrapper.appendChild document.createElement 'br'

		mainWrapper.appendChild viewWrapper

		return

module.exports = ViewImplicitTasks