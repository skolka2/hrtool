ViewBase =  require './viewBase'
ComponentFilterFormatter = require '../components/features/componentFilterFormatter'
ComponentFilter = require '../components/features/componentFilter'
ComponentTableWrapper = require '../components/table/componentTableWrapper'
ComponentTextInput = require '../components/features/componentTextInput'
ComponentTableFactory = require '../components/table/componentTableFactory'
ComponentAddImplicitTask = require '../components/features/addTask/newImplicitTask/componentAddImplicitTask'

class ViewImplicitTasks extends ViewBase
	constructor: ->
		super()

	render: ->
		super()
		
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

		componentAddImplicitTask = new ComponentAddImplicitTask
		componentAddImplicitTask.render addTaskDiv

		viewWrapper.appendChild addTaskDiv
		viewWrapper.appendChild document.createElement 'br'

		mainWrapper.appendChild viewWrapper

		return

module.exports = ViewImplicitTasks