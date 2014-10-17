ComponentBase = require '../../../componentBase'
ComponentLeftBase = require './componentLeftBase'
ComponentCheckBox = require '../../componentCheckBox'
ComponentFilterFormatter = require '../../componentFilterFormatter'
ComponentFilter = require '../../componentFilter'
ComponentDropdown = require '../../componentDropdown'
helper = require '../../../../helpers/helpers'

class ComponentLeft extends ComponentLeftBase
	constructor: () ->
		super()
		@_filter = null
		@_status =
			department_id: -1
			team_id: -1
			save_as_template: false
		@_saveAsNew = new ComponentCheckBox 'Save as template', false
		@listen ComponentBase.eventType.CHANGE, @_saveAsNew, @handleSetAsImplicitChanged

	createDom: () ->
		super()
		@_selectorDiv = document.createElement 'div'
		@_selectorDiv = document.createElement 'div'
		@_selectorDiv.className = "add-task-selector"
		@addChild "checkBox_" + @_saveAsNew.componentId, @_saveAsNew, {el: @_selectorDiv}

		departments = helper.bulk.getData ['departments']
		teams = helper.bulk.getData ['teams']
		data = ComponentFilterFormatter.factory.createTeamDropdownsData departments, teams
		@_filter = new ComponentFilter data, ['department', 'team']
		@_filter.setActive false
		@element.appendChild @_selectorDiv
		@addChild "filter_" + @_filter.componentId, @_filter, {el: @_selectorDiv}

		@listen ComponentDropdown.eventType.CHANGE, @_filter, @handleSetAsImplicitChanged

	getStatus: () ->
		super()
		if @_filter
			filterStatus = @_filter.getStatus()
			@_status.department_id = helper.obj.getData filterStatus, ['department', 'id']
			@_status.team_id = helper.obj.getData filterStatus, ['team', 'id']

		@_status.save_as_template = helper.obj.getData @, ['_saveAsNew', 'checked']
		return @_status

	handleSetAsImplicitChanged: (data) =>
		@_filter.setActive data
		@fire ComponentBase.eventType.CHANGE, @getStatus()

module.exports = ComponentLeft