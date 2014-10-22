ComponentBase = require './componentBase'
ComponentFilterFormatter = require './features/componentFilterFormatter'
ComponentFilter = require './features/componentFilter'
ComponentCheckBox = require './features/componentCheckBox'
app = require '../app'
Model = require '../models/model'
hrtool = require '../models/actions'

module.exports = class ComponentPeopleExport extends ComponentBase

	constructor: ->
		super()
		@mainDiv = document.createElement 'div'
		@mainDiv.className = 'people-export-wrapper'
		@model = new Model ComponentPeopleExport.eventType.DATA_LOAD
		@listen ComponentPeopleExport.eventType.DATA_LOAD, @model, @onLoad
		hrtool.actions.getUsers @model

	onLoad: (data) ->
		users = data
		@departments = app.bulk.departments
		@teams = app.bulk.teams
		@users = {}
		@users[element.id_user] = element for element in users

		allPeopleCheck = new ComponentCheckBox 'All people', false
		@listen ComponentBase.EventType.CHANGE, allPeopleCheck, (data) =>
			@componentFilter.setActive(!data)
			@componentFilter.unselectAll()
		allPeopleCheck.render @mainDiv

		filterData = ComponentFilterFormatter.factory.createNewTaskDropdowns @departments, @teams, @users
		@componentFilter = new ComponentFilter filterData, ['department', 'team', 'user']
		@addChild 'depTeamUserFilter', @componentFilter, el: @mainDiv
		@componentFilter.render @mainDiv

		submitButton = document.createElement 'button'
		submitButton.className = 'people-export-submit'
		submitButton.innerHTML = 'Export CSV'
		submitButton.addEventListener 'click', =>
			window.location.origin = window.location.protocol+"//"+window.location.host if not window.location.origin
			selected = @componentFilter.getStatus()
			params = ''
			params += '?department=' + selected.department.id if selected.department.id >= 0
			params += '&team=' + selected.team.id if selected.team.id >= 0
			params += '&user=' + selected.user.id if selected.user.id >= 0
			window.open window.location.origin + '/app/get/peopleExport' + params
		@mainDiv.appendChild submitButton

	ComponentPeopleExport.eventType =
		DATA_LOAD: 'user/get-all'

	createDom: ->
		@element = @mainDiv