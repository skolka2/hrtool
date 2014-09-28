ComponentPopup = require './componentPopup'
ComponentCheckBox = require './features/componentCheckBox'
ComponentFilter = require './features/componentFilter'
ComponentSelectFactory = require './features/componentSelectFactory'
ComponentSelect= require './features/componentSelect'
ComponentEditUser = require './componentEditUser'
ComponentAddTask = require './features/addTask/newTask/componentAddTask'
ComponentBase = require './componentBase'

module.exports = ComponentPopupFactory =
	getCheckBoxPopup:(popupTrigger, filter) ->
		popupCheckbox = new ComponentCheckBox "test", yes
		popup = new ComponentPopup(popupTrigger, popupCheckbox)

		if filter?
			popup.listen ComponentFilter.EventType.UPDATED, filter, popup.open

		return popup
	getSelectDepTeamPopup: (popupTrigger)->
		select = new ComponentSelectFactory.createDepartmentTeam()
		popup = new ComponentPopup popupTrigger, select
		popup.listen ComponentSelect.EventType.CANCEL, select, popup.close
		return popup

	getUserEditPopup: (idUser) ->
		componentEditUser = new ComponentEditUser idUser, yes
		popup = new ComponentPopup(componentEditUser)
		popup.listen ComponentEditUser.EventType.SAVE, componentEditUser, popup.close
		popup.listen ComponentEditUser.EventType.CANCEL, componentEditUser, popup.close
		return popup

	getNewTaskPopup:  ->
		componentAddTask = new ComponentAddTask()
		popup = new ComponentPopup(componentAddTask)
		popup.listen ComponentAddTask.EventType.SAVE_SUCCESS, componentAddTask, popup.close
		return popup
