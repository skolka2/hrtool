ComponentPopup = require './componentPopup'
ComponentCheckBox = require './features/componentCheckBox'
ComponentFilter = require './features/componentFilter'
ComponentSelectFactory = require './features/componentSelectFactory'
ComponentSelect= require './features/componentSelect'

module.exports = ComponentPopupFactory =
	getCheckBoxPopup:(popupTrigger, filter) ->
		popupCheckbox = new ComponentCheckBox "test", true
		popup = new ComponentPopup(popupTrigger, popupCheckbox)

		if filter?
			popup.listen ComponentFilter.EventType.UPDATED, filter, popup.open

		return popup
	getSelectDepTeamPopup: (popupTrigger)->
		select = new ComponentSelectFactory.createDepartmentTeam()
		popup = new ComponentPopup popupTrigger, select
		popup.listen ComponentSelect.EventType.CANCEL, select, popup.close
		return popup