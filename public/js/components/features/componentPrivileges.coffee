Model = require '../../models/model'
hrtool = require '../../models/actions'
ComponentBase = require '../componentBase'
ComponentNotificationCenter = require '../componentNotificationCenter'

class ComponentPrivileges extends ComponentBase
	constructor:() ->
		super()
		return

	isAdminOrManager: (userId, callback) ->
		this.callback = callback
		model =new Model(ComponentPrivileges.eventType.IS_ADMIN_OR_MANAGER)
		@listen(ComponentPrivileges.eventType.IS_ADMIN_OR_MANAGER ,model, @onLoad)
		hrtool.actions.isAdminOrManager model, userId
		return

	onLoad: (isAdmin) =>
		if(isAdmin.error)
			errMsg = isAdmin.error;
			isAdmin= false;
		@callback(isAdmin, errMsg)

	isNotAdminNotification: (message)->
		newDiv = document.createElement 'div'
		newDiv.innerHTML = message
		@addNotification newDiv, 3000, ComponentNotificationCenter.eventType.ERROR

ComponentPrivileges.eventType.IS_ADMIN_OR_MANAGER = 'tasks/view/isadmin'
module.exports = ComponentPrivileges