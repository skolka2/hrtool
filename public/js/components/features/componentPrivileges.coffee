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
			isAdmin= false;
		@callback(isAdmin)

	isNotAdminNotification:->
		newDiv = document.createElement 'div'
		newDiv.innerHTML = "You don´t have permission to see user´s view. "
		@addNotification newDiv, 3000, ComponentNotificationCenter.eventType.error
		#setTimeout (->window.location = "../#"),5000

ComponentPrivileges.eventType.IS_ADMIN_OR_MANAGER = 'tasks/view/isadmin'
module.exports = ComponentPrivileges