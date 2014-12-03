ComponentPopup = require './componentPopup'
ComponentCheckBox = require './features/componentCheckBox'
ComponentFilter = require './features/componentFilter'
ComponentSelectFactory = require './features/componentSelectFactory'
ComponentSelect= require './features/componentSelect'
ComponentEditUser = require './componentEditUser'
ComponentAddTask = require './tasks/addTask/newTask/componentAddTask'
ComponentFormAddUser = require './forms/componentFormAddUser'
ComponentBase = require './componentBase'

module.exports = ComponentPopupFactory =
	getCheckBoxPopup:(popupTrigger, filter) ->
		popupCheckbox = new ComponentCheckBox "test", yes
		popup = new ComponentPopup(popupTrigger, popupCheckbox)

		if filter?
			popup.listen ComponentFilter.eventType.UPDATED, filter, popup.open
		return popup

		
	getSelectDepTeamPopup: (popupTrigger)->
		select = new ComponentSelectFactory.createDepartmentTeam()
		popup = new ComponentPopup popupTrigger, select
		popup.listen ComponentSelect.eventType.CANCEL, select, popup.close
		return popup

	getUserEditPopup: (idUser) ->
		componentEditUser = new ComponentEditUser idUser, yes
		popup = new ComponentPopup(componentEditUser)
		popup.listen ComponentEditUser.eventType.SAVE, componentEditUser, popup.close
		popup.listen ComponentEditUser.eventType.CANCEL, componentEditUser, popup.close
		return popup

	getNewTaskPopup:  (preselectedUserData, preselectedBuddy)->
		componentAddTask = new ComponentAddTask preselectedUserData, preselectedBuddy
		popup = new ComponentPopup(componentAddTask)
		popup.listen ComponentAddTask.eventType.SAVE_SUCCESS, componentAddTask, popup.close
		return popup

	getNewUserPopup: ->
		componentAddUser = new ComponentFormAddUser()
		popup = new ComponentPopup(componentAddUser)
		popup.listen ComponentFormAddUser.eventType.SAVE, componentAddUser, popup.close
		popup
