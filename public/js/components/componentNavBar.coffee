ComponentBase = require './componentBase'
Const = require '../helpers/constants'
app = require '../app'

module.exports = class ComponentNavBar extends ComponentBase

	constructor: ->
		super()


	createDom: ->
		div = document.getElementById ComponentNavBar.ID
		loggedIn = no
		loggedIn = yes if app and app.bulk
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
			loggedIn : !!app and !!app.bulk
		template = @helper.tpl.create "components/componentNavBar", jadeData
		div.appendChild template
	render: ->
		if !@rendered
			document.getElementById('navbar').innerHTML = '<a href="/auth/google" id="login-button">Login</a>'
			document.getElementById('login-button').style.display = 'none'
			@rendered = true
			@createDom()



	ComponentNavBar.ID = "navbar"