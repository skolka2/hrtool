ComponentBase = require './componentBase'
Const = require '../helpers/constants'
app = require '../app'

module.exports = class ComponentNavBar extends ComponentBase

	constructor: ->
		super()
	createDom: ->
		loggedIn = no
		loggedIn = yes if app?.bulk?

		if loggedIn
			jadeData =
				userID : @helper.bulk.getData ['user', 'id_user']
				userFirstName: @helper.bulk.getData ['user', 'first_name']
				userLastName: @helper.bulk.getData ['user', 'last_name']
				userRoleID : @helper.bulk.getData ['user', 'id_user_role']
				teamManagerID : Const.TEAM_MANAGER
				administratorID : Const.ADMINISTRATOR
				HRemail: @helper.bulk.getData ['hrBuddy', 'email']
				HRfirstName: @helper.bulk.getData ['hrBuddy', 'first_name']
				HRlastName: @helper.bulk.getData ['hrBuddy', 'last_name']
				loggedIn : loggedIn

		else
			jadeData =
				loggedIn : loggedIn


		@element = @helper.tpl.create "components/componentNavBar", jadeData

	render: ->
		if !@rendered
			div = document.getElementById ComponentNavBar.ID
			div.innerHTML = ""
			super div



	ComponentNavBar.ID = "navbar"