ViewBase =  require './viewBase'
Const = require '../helpers/constants'
helper = require '../helpers/helpers'
btnFactory = require '../factories/buttons'


class ViewHomeBase extends ViewBase
	constructor: (parameters)->
		@routerParams = parameters
		super()

	render : ->
		super()
		mainWrapper = document.getElementById ViewBase.mainWrapper
		viewWrapper = document.createElement 'div'
		userRole = helper.bulk.getData ['user', 'id_user_role']
		viewWrapper.className = 'view-home-menu'

		@homeMenu userRole, viewWrapper

		mainWrapper.appendChild viewWrapper



	homeMenu : (userRole, viewWrapper) ->
		tmpRouter = ''
		if @routerParams?.user?
				tmpRouter = '?user=' + @routerParams.user

		activeSection = location.hash
		viewWrapper.appendChild btnFactory.create('#home'+ tmpRouter, ViewHomeBase.messages.MENU_MY_TASKS , activeSection)
		viewWrapper.appendChild btnFactory.create('#buddy_tasks' + tmpRouter,  ViewHomeBase.messages.MENU_BUDDY_TASKS, activeSection)
		if tmpRouter is '' and (userRole is Const.TEAM_MANAGER or userRole is Const.ADMINISTRATOR)
			viewWrapper.appendChild btnFactory.create('#team_tasks',ViewHomeBase.messages.MENU_TEAM_TASKS, activeSection)
			viewWrapper.appendChild btnFactory.createPopupButton(ViewHomeBase.messages.BUTTON_ADD_TASK, 'bt-home-add-task')



ViewHomeBase.messages =
	MENU_MY_TASKS : 'My tasks'
	MENU_BUDDY_TASKS : 'Buddy tasks'
	MENU_TEAM_TASKS : 'Team tasks'
	BUTTON_ADD_TASK : 'Add new task'

module.exports = ViewHomeBase