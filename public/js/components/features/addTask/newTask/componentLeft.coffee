ComponentBase = require '../../../componentBase'
ComponentCheckBox = require '../../componentCheckBox'
ComponentFilterFormatter = require '../../componentFilterFormatter'
ComponentFilter = require '../../componentFilter'
ComponentDropdown = require '../../componentDropdown'
helper = require '../../../../helpers/helpers'

class ComponentLeft extends ComponentBase
	constructor: () ->
		super()
		@_filter = null
		@_status =
			title: ""
			description: ""
			department_id: -1
			team_id: -1
			save_as_template: false
		@_title = null
		@_text = null
		@_saveAsNew = new ComponentCheckBox 'Save as template', false
		@listen ComponentBase.eventType.CHANGE, @_saveAsNew, @handleSetAsImplicitChanged

	createDom: () ->
		@element = document.createElement 'div'
		@element.className = 'add-task-wrapper'

		#Header
		labelDiv = document.createElement 'div'
		labelDiv.className = "add-task-header"
		labelDiv.innerText = 'Task'

		#Wrapper of task's title
		titleDiv = document.createElement "div"

		taskTitle = document.createElement 'span'
		taskTitle.className = "add-task-title-label"
		taskTitle.innerText = "Task title"

		titleDiv.appendChild taskTitle
		@_title = document.createElement 'input'
		@_title.id = @componentId + '-title'
		titleDiv.appendChild @_title

		#Wrapper of task's text
		textDiv = document.createElement "div"

		taskText = document.createElement 'span'
		taskText.className = 'add-task-text-label'
		taskText.innerText = 'Task description'

		textDiv.appendChild taskText
		@_text = document.createElement 'textarea'
		@_text.id = @componentId + '-text'
		textDiv.appendChild @_text

		@_selectorDiv = document.createElement 'div'
		@_selectorDiv.className = "add-task-selector"

		@element.appendChild labelDiv
		@element.appendChild titleDiv
		@element.appendChild textDiv
		@addChild "checkBox_" + @_saveAsNew.componentId, @_saveAsNew, {el: @_selectorDiv}

		departments = @helper.bulk.getData ['departments']
		teams = @helper.bulk.getData ['teams']
		data = ComponentFilterFormatter.factory.createTeamDropdownsData departments, teams
		@_filter = new ComponentFilter data, ['department', 'team']
		@_filter.setActive false
		@element.appendChild @_selectorDiv
		@addChild "filter_" + @_filter.componentId, @_filter, {el: @_selectorDiv}

		@listen ComponentDropdown.eventType.CHANGE, @_filter, @handleSetAsImplicitChanged


	getStatus: () ->
		if @_filter
			filterStatus = @_filter.getStatus()
			@_status.department_id = helper.obj.getData filterStatus, ['department', 'id']
			@_status.team_id = helper.obj.getData filterStatus, ['team', 'id']

		@_status.title = helper.obj.getData @, ['_title', 'value']
		@_status.description = helper.obj.getData @, ['_text', 'value']
		@_status.save_as_template = helper.obj.getData @, ['_saveAsNew', 'checked']
		return @_status

	handleSetAsImplicitChanged: (data) =>
		@_filter.setActive data
		@fire ComponentBase.eventType.CHANGE, @getStatus()


		
module.exports = ComponentLeft