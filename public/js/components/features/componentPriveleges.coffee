Model = require '../../models/model'
hrtool = require '../../models/actions'

ComponentPrivelegesFactory =

createUserStatusBar: (userId) ->
	statusBarModel = new Model ComponentStatusBar.EventType.USER_INFO_LOAD
	statusBar.setModel statusBarModel, ComponentStatusBar.EventType.USER_INFO_LOAD
	hrtool.actions.isAdminOrManager statusBar.model, userId
	statusBar

module.exports = ComponentPrivelegesFactory