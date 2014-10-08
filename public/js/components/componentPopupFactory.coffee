ComponentPopup = require './componentPopup'
ComponentCheckBox = require './features/componentCheckBox'
ComponentFilter = require './features/componentFilter'

module.exports = ComponentPopupFactory =
	getCheckBoxPopup:(popupTrigger, filter) ->
		popupCheckbox = new ComponentCheckBox "test", true
		popup = new ComponentPopup(popupTrigger, popupCheckbox)

		if filter?
			popup.listen ComponentFilter.EventType.UPDATED, filter, popup.open

		return popup