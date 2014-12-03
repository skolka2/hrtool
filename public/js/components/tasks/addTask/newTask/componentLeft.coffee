ComponentBase = require '../../../componentBase'
ComponentLeftBase = require '../componentLeftBase'
ComponentCheckBox = require '../../../features/componentCheckBox'
ComponentFilterFormatter = require '../../../features/componentFilterFormatter'
ComponentFilter = require '../../../features/componentFilter'
ComponentDropdown = require '../../../features/componentDropdown'
helper = require '../../../../helpers/helpers'

class ComponentLeft extends ComponentLeftBase
	constructor: ->
		super()
		@_filterTeam1 = null
		@_status =
			department_id: -1
			team_id: -1
			save_as_template: no
		@_saveAsNew = new ComponentCheckBox 'Save as template', no
		@listen ComponentBase.eventType.CHANGE, @_saveAsNew, @handleSetAsImplicitChanged

	createDom: ->
		super()
		@_selectorDiv = document.createElement 'div'
		@_selectorDiv = document.createElement 'div'
		@_selectorDiv.className = "add-task-selector"
		@addChild "checkBox_" + @_saveAsNew.componentId, @_saveAsNew, {el: @_selectorDiv}

		departments = helper.bulk.getData ['departments']
		teams = helper.bulk.getData ['teams']
		data = ComponentFilterFormatter.factory.createTeamDropdownsData departments, teams
		@_filterTeam1 = new ComponentFilter data, ['department', 'team']
		@_filterTeam1.setActive no
		@element.appendChild @_selectorDiv
		@addChild "filter_" + @_filterTeam1.componentId, @_filterTeam1, {el: @_selectorDiv}

		@listen ComponentBase.eventType.CHANGE, @_filterTeam1, @handleSetAsImplicitChanged

	getStatus: ->
		super()
		if @_filterTeam1
			filterStatus = @_filterTeam1.getStatus()
			@_status.department_id = helper.obj.getData filterStatus, ['department', 'id']
			@_status.team_id = helper.obj.getData filterStatus, ['team', 'id']

		@_status.save_as_template = helper.obj.getData @, ['_saveAsNew', 'checked']
		return @_status

	handleSetAsImplicitChanged: (data) =>
		@_filterTeam1.setActive data
		@fire ComponentBase.eventType.CHANGE, @getStatus()

module.exports = ComponentLeft