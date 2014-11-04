ViewBase =  require './viewBase'
ComponentFormAddUser = require '../components/forms/componentFormAddUser'
ComponentFilterFormatter = require '../components/features/componentFilterFormatter'
ComponentFilter = require '../components/features/componentFilter'
ComponentTableWrapper = require '../components/table/componentTableWrapper'
ComponentTextInput = require '../components/features/componentTextInput'
ComponentTableFactory = require '../components/table/componentTableFactory'

class ViewPeopleAdmin extends ViewBase
	constructor: ->
		super()

	render: ->
		super()

		mainWrapper = document.getElementById ViewBase.mainWrapper
		viewWrapper = document.createElement 'div'
		viewWrapper.className = "view-wraper"
		viewWrapper.innerHTML = "People Admin View"

		tableDiv = document.createElement 'div'
		tableDiv.innerHTML = "Table of users"
		viewWrapper.appendChild tableDiv
		viewWrapper.appendChild document.createElement 'br'

		divForm = document.createElement 'div'
		divForm.innerHTML = "<br/><br/><br/><br/>ComponentFormAddUser...<br><br>"
		viewWrapper.appendChild divForm
		viewWrapper.appendChild document.createElement 'br'

		filterData = ComponentFilterFormatter.factory.createTeamDropdownsData @helper.bulk.getDepartmentData(), @helper.bulk.getTeamData()
		userTable = new ComponentTableWrapper ComponentTableFactory.createUsersTable(), new ComponentFilter(filterData), new ComponentTextInput 'Type name'
		userTable.render tableDiv

		form = new ComponentFormAddUser()
		form.render divForm

		mainWrapper.appendChild viewWrapper
		
		return

module.exports = ViewPeopleAdmin