ComponentBase = require './componentBase'
Model = require '../models/model'
ComponentCheckBox = require './features/componentCheckBox'
ComponentFilter = require './features/componentFilter'
ComponentDropdown = require './features/componentDropdown'
ComponentFilterFormatter = require './features/componentFilterFormatter'
hrtool = require '../models/actions'
app = require '../app'

class ComponentEditUser extends ComponentBase
	constructor: (@idUser, @editable = no) ->
		super()
		@teams = []
		@checkboxes = []


		model = new Model ComponentEditUser.EventType.GET_USERS
		@setModel model, ComponentEditUser.EventType.GET_USERS
		hrtool.actions.getUserTeams @model, {id_user: idUser}

		infoModel = new Model ComponentEditUser.EventType.GET_INFO
		hrtool.actions.getBasicUserInfo infoModel, {id_user: idUser}
		@listen ComponentEditUser.EventType.GET_INFO, infoModel, @onInfoLoad

		usersModel = new Model ComponentEditUser.EventType.GET_USERS
		hrtool.actions.getUsers usersModel
		@listen ComponentEditUser.EventType.GET_USERS, usersModel, @onUsersLoad



	onLoad: (data) =>
		@teams = data
		@repaintTeams()
		return


	onInfoLoad: (data) =>
		@userInfoWrapper.style.display = 'block' if @editable is yes

		@nameInput = @element.getElementsByClassName(ComponentEditUser.INPUT_NAME_CLASS)[0]
		@surnameInput = @element.getElementsByClassName(ComponentEditUser.INPUT_SURNAME_CLASS)[0]
		@emailInput = @element.getElementsByClassName(ComponentEditUser.INPUT_EMAIL_CLASS)[0]

		@nameInput.value = data.first_name
		@surnameInput.value = data.last_name
		@emailInput.value = data.email

		@userRoleWrapper = @element.getElementsByClassName(ComponentEditUser.USER_ROLE_WRAPPER_CLASS)[0]

		dropData = ComponentFilterFormatter.transform app.bulk.userRoles, 'id_user_role', 'title'
		@userRoleDropdown = new ComponentDropdown dropData['']
		@addChild 'userRoleDropDown', @userRoleDropdown, {el: @userRoleWrapper}
		@userRoleDropdown.render @userRoleWrapper
		return


	onUsersLoad: (data) ->
		users = {}
		users[item.unique_id] = item for item in data

		@buddySelectWrapper = @element.getElementsByClassName(ComponentEditUser.BUDDY_SELECT_WRAPPER_CLASS)[0]
		usersData = ComponentFilterFormatter.factory.createUsersDropdownsData app.bulk.departments, app.bulk.teams, users
		@buddyFilter = new ComponentFilter usersData, ['department', 'team', 'user']
		@addChild 'buddyFilter', @buddyFilter, {el: @buddySelectWrapper}
		@buddyFilter.render @buddySelectWrapper
		return



	createDom: ()->
		@element = @helper.tpl.create 'components/componentEditUser',
			wrapperClass: ComponentEditUser.WRAPPER_CLASS
			teamWrapper: ComponentEditUser.TEAM_WRAPPER_CLASS
			userInfoWrapper: ComponentEditUser.USER_INFO_WRAPPER_CLASS
			inputName: ComponentEditUser.INPUT_NAME_CLASS
			inputSurname: ComponentEditUser.INPUT_SURNAME_CLASS
			inputEmail: ComponentEditUser.INPUT_EMAIL_CLASS
			userRoleWrapper: ComponentEditUser.USER_ROLE_WRAPPER_CLASS
			buddySelectWrapper: ComponentEditUser.BUDDY_SELECT_WRAPPER_CLASS
			buttonDiv: ComponentEditUser.BUTTON_DIV_WRAPPER_CLASS
			buttonCancel: ComponentEditUser.BUTTON_CANCEL_CLASS
			buttonSave: ComponentEditUser.BUTTON_SAVE_CLASS

		@teamWrapper = @element.getElementsByClassName(ComponentEditUser.TEAM_WRAPPER_CLASS)[0]
		@userInfoWrapper = @element.getElementsByClassName(ComponentEditUser.USER_INFO_WRAPPER_CLASS)[0]
		@buttonsWrapper = @element.getElementsByClassName(ComponentEditUser.BUTTON_DIV_WRAPPER_CLASS)[0]

		if @editable is no
			@userInfoWrapper.style.display = 'none'
			@buttonsWrapper.style.display = 'none'

		saveButton = @element.getElementsByClassName(ComponentEditUser.BUTTON_SAVE_CLASS)[0]
		cancelButton = @element.getElementsByClassName(ComponentEditUser.BUTTON_CANCEL_CLASS)[0]

		saveButton.addEventListener ComponentBase.EventType.CLICK, @fireSave
		return


	fireSave: () =>
		@fire ComponentEditUser.EventType.SAVE, null, @
		return


	repaintTeams: () ->
		for item, i in @teams
			div = document.createElement 'div'
			div.className = ComponentEditUser.ITEM_WRAPPER_CLASS
			span = document.createElement 'span'
			span.innerHTML = "#{item.department}/#{item.team}"

			if @editable is yes
				button = document.createElement 'button'
				button.innerHTML = 'x'
				button.addEventListener ComponentBase.EventType.CLICK, @removeItem, no
				span.appendChild button

			checkbox = new ComponentCheckBox 'Manager', item.is_admin, @editable
			@checkboxes.push checkbox

			div.appendChild checkbox.getElement()
			div.appendChild span
			@teamWrapper.appendChild div


		if @teams.length is 0
			@teamWrapper.innerHTML = 'There is no team this user is in'

		if @editable is yes
			button = document.createElement 'button'
			button.innerHTML = '+'
			button.className = 'down-left-corner'
			button.addEventListener ComponentBase.EventType.CLICK, @addItem, no
			@teamWrapper.appendChild document.createElement 'br'
			@teamWrapper.appendChild button
			@teamWrapper.appendChild document.createElement 'br'



	removeItem: (event) =>
		event.target.parentElement?.parentElement?.style.display = 'none'
		#@repaintTeams()

	addItem: () =>
		console.log 'přidávám item  -> nutno dodělat' #TODO: Dodělat přidávání itemu
		#@repaintTeams()



ComponentEditUser.WRAPPER_CLASS = 'edit-user'
ComponentEditUser.ITEM_WRAPPER_CLASS = 'edit-user-team-item'
ComponentEditUser.TEAM_WRAPPER_CLASS = 'team-wrapper'
ComponentEditUser.USER_INFO_WRAPPER_CLASS = 'user-info-wrapper'
ComponentEditUser.INPUT_NAME_CLASS = 'input-name'
ComponentEditUser.INPUT_SURNAME_CLASS = 'input-surname'
ComponentEditUser.INPUT_EMAIL_CLASS = 'input-email'
ComponentEditUser.USER_INFO_WRAPPER_CLASS = 'user-info-wrapper'
ComponentEditUser.USER_ROLE_WRAPPER_CLASS = 'user-role-wrapper'
ComponentEditUser.BUDDY_SELECT_WRAPPER_CLASS = 'buddy-select-wrapper'
ComponentEditUser.BUTTON_DIV_WRAPPER_CLASS = 'buttons-wrapper'
ComponentEditUser.BUTTON_CANCEL_CLASS = 'button-cancel'
ComponentEditUser.BUTTON_SAVE_CLASS = 'button-save'

ComponentEditUser.EventType =
	GET_DATA: 'user/get-teams'
	GET_INFO: 'user/get-basic-info'
	GET_USERS: 'user/get-all'
	SAVE: 'save'
	CANCEL: 'cancel'

module.exports = ComponentEditUser