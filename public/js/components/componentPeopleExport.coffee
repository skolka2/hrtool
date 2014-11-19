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
		allPeopleCheck.render @getElement()

		filterData = ComponentFilterFormatter.factory.createNewTaskDropdowns @departments, @teams, @users
		@componentFilter = new ComponentFilter filterData, ['department', 'team', 'user']
		@addChild 'depTeamUserFilter', @componentFilter, el: @getElement()
		@componentFilter.render @getElement()

		submitButton = document.createElement 'button'
		submitButton.className = 'people-export-submit'
		submitButton.innerHTML = 'Export CSV'
		submitButton.addEventListener ComponentBase.CLICK_EVENT, =>
			location = window.location.origin or window.location.protocol+"//"+window.location.host
			selected = @componentFilter.getStatus()
			params = ''
			params += '?department=' + selected.department.id if selected.department.id >= 0
			params += '&team=' + selected.team.id if selected.team.id >= 0
			params += '&user=' + selected.user.id if selected.user.id >= 0
			window.open location + '/app/get/peopleExport' + params
		@getElement().appendChild submitButton

	createDom: ->
		mainDiv = document.createElement 'div'
		mainDiv.className = 'people-export-wrapper'
		@element = mainDiv

	ComponentPeopleExport.eventType =
		DATA_LOAD: 'user/get-all'
