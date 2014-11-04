ViewBase =  require './viewBase'
ComponentBase = require '../components/componentBase'
ComponentPopupFactory = require '../components/componentPopupFactory'
ComponentFilterFormatter = require '../components/features/componentFilterFormatter'
ComponentFilter = require '../components/features/componentFilter'
ComponentTableWrapper = require '../components/table/componentTableWrapper'
ComponentTextInput = require '../components/features/componentTextInput'
ComponentTableFactory = require '../components/table/componentTableFactory'

class ViewPeople extends ViewBase
	constructor: ->
		super()

	render: ->
		super()

		mainWrapper = document.getElementById ViewBase.mainWrapper
		viewWrapper = document.createElement 'div'
		viewWrapper.className = "view-wraper"
		viewWrapper.innerHTML = "People Admin View"

		addUserButton = document.createElement 'button'
		addUserButton.innerHTML = "Add new user"
		addUserButton.addEventListener ComponentBase.CLICK_EVENT, @handleAddUserPopup
		viewWrapper.appendChild addUserButton
		viewWrapper.appendChild document.createElement 'br'

		tableDiv = document.createElement 'div'
		tableDiv.innerHTML = "Table of users"
		viewWrapper.appendChild tableDiv
		viewWrapper.appendChild document.createElement 'br'

		filterData = ComponentFilterFormatter.factory.createTeamDropdownsData @helper.bulk.getDepartmentData(), @helper.bulk.getTeamData()
		userTable = new ComponentTableWrapper ComponentTableFactory.createUsersTable(), new ComponentFilter(filterData), new ComponentTextInput 'Type name'
		userTable.render tableDiv

		mainWrapper.appendChild viewWrapper
		
		return

	handleAddUserPopup: (ev) =>
		addUserPopup = ComponentPopupFactory.getNewUserPopup()
		addUserPopup.open()
		return

module.exports = ViewPeople