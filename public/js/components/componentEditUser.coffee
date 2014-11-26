ComponentBase = require './componentBase'
Model = require '../models/model'
ComponentCheckBox = require './features/componentCheckBox'
ComponentFilter = require './features/componentFilter'
ComponentDropdown = require './features/componentDropdown'
ComponentFilterFormatter = require './features/componentFilterFormatter'
NotificationCenter = require './componentNotificationCenter'
hrtool = require '../models/actions'
app = require '../app'

class ComponentEditUser extends ComponentBase
	constructor: (@idUser, @editable = no) ->
		super()
		@teams = []
		@checkboxes = []

		model = new Model ComponentEditUser.eventType.GET_USERS
		@setModel model, ComponentEditUser.eventType.GET_USERS
		hrtool.actions.getUserTeams @model, {id_user: idUser}


		infoModel = new Model ComponentEditUser.eventType.GET_INFO
		@listen ComponentEditUser.eventType.GET_INFO, infoModel, @onInfoLoad
		hrtool.actions.getBasicUserInfo infoModel, {id_user: idUser}

		@usersModel = new Model ComponentEditUser.eventType.GET_USERS
		@listen ComponentEditUser.eventType.GET_USERS, @usersModel, @onUsersLoad



	onLoad: (data) =>
		@teams = data
		@createTeamItems()
		return


	onInfoLoad: (data) =>
		@userInfoWrapper.style.display = 'block' if @editable is yes

		@nameInput = @element.getElementsByClassName(ComponentEditUser.classes.INPUT_NAME_CLASS)[0]
		@surnameInput = @element.getElementsByClassName(ComponentEditUser.classes.INPUT_SURNAME_CLASS)[0]
		@emailInput = @element.getElementsByClassName(ComponentEditUser.classes.INPUT_EMAIL_CLASS)[0]

		@nameInput.value = data.first_name
		@surnameInput.value = data.last_name
		@emailInput.value = data.email

		@userRoleWrapper = @element.getElementsByClassName(ComponentEditUser.classes.USER_ROLE_WRAPPER_CLASS)[0]

		dropData = ComponentFilterFormatter.transform app?.bulk?.userRoles, 'id_user_role', 'title'
		@userRoleDropdown = new ComponentDropdown dropData['']
		@userRoleDropdown.setSelectionById data.id_user_role
		@addChild 'userRoleDropDown', @userRoleDropdown, {el: @userRoleWrapper}
		@userRoleDropdown.render @userRoleWrapper

		@idBuddy = data.id_buddy;
		hrtool.actions.getUsers @usersModel
		return


	onUsersLoad: (data) ->
		users = {}
		for item in data
			users[item.id_user] =
				id_user : item.id_user
				full_name: item.first_name+' '+item.last_name

		@buddySelectWrapper = @element.getElementsByClassName(ComponentEditUser.classes.BUDDY_SELECT_WRAPPER_CLASS)[0]
		usersData = ComponentFilterFormatter.transform users, 'id_user', 'full_name'
		@buddyDropdown = new ComponentDropdown usersData[''], true
		@buddyDropdown.setSelectionById @idBuddy
		@addChild 'buddyDropdown', @buddyDropdown, {el: @buddySelectWrapper}
		@buddyDropdown.render @buddySelectWrapper
		return



	createDom: ()->
		@element = @helper.tpl.create 'components/componentEditUser'

		@teamWrapper = @element.getElementsByClassName(ComponentEditUser.classes.TEAM_WRAPPER_CLASS)[0]
		@newTeamWrapper = @element.getElementsByClassName(ComponentEditUser.classes.NEW_TEAM_WRAPPER_CLASS)[0]
		@userInfoWrapper = @element.getElementsByClassName(ComponentEditUser.classes.USER_INFO_WRAPPER_CLASS)[0]
		@buttonsWrapper = @element.getElementsByClassName(ComponentEditUser.classes.BUTTON_DIV_WRAPPER_CLASS)[0]

		if @editable is no
			@userInfoWrapper.style.display = 'none'
			@buttonsWrapper.style.display = 'none'

		saveButton = @element.getElementsByClassName(ComponentEditUser.classes.BUTTON_SAVE_CLASS)[0]
		cancelButton = @element.getElementsByClassName(ComponentEditUser.classes.BUTTON_CANCEL_CLASS)[0]

		saveButton.addEventListener ComponentBase.eventType.CLICK, () =>
			@handleSaveClick()
			@fire ComponentEditUser.eventType.SAVE, null
		cancelButton.addEventListener ComponentBase.eventType.CLICK, () =>
			@fire ComponentEditUser.eventType.SAVE, null
		return




	handleSaveClick: () ->
		#TODO: dodělat endpoint na editaci dat uživatele a na mazání a přidávání týmů (jesli už nejsou)
		console.log 'ukládám změny -> taky dodělat odeslání změn údajů na backend'




	createTeamItems: () ->
		for item, i in @teams
			@teamWrapper.appendChild @getTeamItemDom item, i

		if @teams.length is 0
			@teamWrapper.innerHTML = 'There is no team this user is in'

		if @editable is yes
			@createNewTeamDom()

		return



	getTeamItemDom: (team, index) ->
		div = document.createElement 'div'
		div.className = ComponentEditUser.classes.ITEM_WRAPPER_CLASS
		span = document.createElement 'span'
		span.innerHTML = "#{team.department}/#{team.team}"

		if @editable is yes
			button = document.createElement 'button'
			button.innerHTML = 'x'
			button.addEventListener ComponentBase.eventType.CLICK, do (index) =>
					(event) =>
						@teams[index] = null
						event.target.parentElement?.parentElement?.style.display = 'none'
			, no
			span.appendChild button

		checkbox = new ComponentCheckBox 'Manager', team.is_admin, @editable
		@checkboxes.push checkbox

		div.appendChild checkbox.getElement()
		div.appendChild span
		return div




	createNewTeamDom: () ->
		data = ComponentFilterFormatter.factory.createTeamDropdownsData app?.bulk?.departments, app?.bulk?.teams
		@newTeamFilter = new ComponentFilter data, ['department', 'team']
		@addChild 'teamFilter', @newTeamFilter, {el: @newTeamWrapper}
		@newTeamFilter.render @newTeamWrapper

		@newTeamCheckBox = new ComponentCheckBox 'Manager', true, true
		this.addChild 'newTeamCheckBox', @newTeamCheckBox, {el: @newTeamWrapper}
		@newTeamCheckBox.render @newTeamWrapper

		button = document.createElement 'button'
		button.innerHTML = '+'
		button.className = 'down-left-corner'
		button.addEventListener ComponentBase.eventType.CLICK, @addItem, no
		@newTeamWrapper.appendChild document.createElement 'br'
		@newTeamWrapper.appendChild button
		@newTeamWrapper.appendChild document.createElement 'br'
		return




	addItem: () =>
		status = @newTeamFilter.getStatus()
		if status.team isnt ComponentDropdown.EmptyOption
			isIn = no
			(isIn = true; break) for team in @teams when status.team.id is team?.id_team
			if isIn is no
				@teams.push
					is_admin: @newTeamCheckBox.isChecked()
					department: status.department.value
					id_department: status.department.id
					team: status.team.value
					id_team: status.team.id
				index = @teams.length - 1;
				@teamWrapper.appendChild @getTeamItemDom @teams[index], index
			else
				@addNotification ComponentEditUser.messages.SAME_TEAM, NotificationCenter.DEFAULT_TIME, NotificationCenter.eventType.ERROR
		else
			@addNotification ComponentEditUser.messages.NO_TEAM, NotificationCenter.DEFAULT_TIME, NotificationCenter.eventType.ERROR
		return


ComponentEditUser.messages =
	SAME_TEAM: 'User is allready in this team!'
	NO_TEAM_SELECTED: 'You have to choose a team!'


ComponentEditUser.classes =
	ITEM_WRAPPER_CLASS: 'edit-user-team-item'
	TEAM_WRAPPER_CLASS: 'team-wrapper'
	NEW_TEAM_WRAPPER_CLASS: 'new-team-wrapper'
	USER_INFO_WRAPPER_CLASS: 'user-info-wrapper'
	INPUT_NAME_CLASS: 'input-name'
	INPUT_SURNAME_CLASS: 'input-surname'
	INPUT_EMAIL_CLASS: 'input-email'
	USER_ROLE_WRAPPER_CLASS: 'user-role-wrapper'
	BUDDY_SELECT_WRAPPER_CLASS: 'buddy-select-wrapper'
	BUTTON_DIV_WRAPPER_CLASS: 'buttons-wrapper'
	BUTTON_CANCEL_CLASS: 'button-cancel'
	BUTTON_SAVE_CLASS: 'button-save'

ComponentEditUser.eventType =
	GET_DATA: 'user/get-teams'
	GET_INFO: 'user/get-basic-info'
	GET_USERS: 'user/get-all'
	SAVE: 'save'
	CANCEL: 'cancel'

module.exports = ComponentEditUser