ViewBase =  require './viewBase'

btnFactory = require '../factories/buttons'

class ViewTasks extends ViewBase
	constructor: ->
		super()

	render: ->
		super()
		mainWrapper = document.getElementById ViewBase.mainWrapper
		viewWrapper = document.createElement 'div'
		viewWrapper.className = "view-wraper"
		viewWrapper.innerHTML = "Task Admin View"
		viewWrapper.appendChild document.createElement 'br'

		viewWrapper.appendChild btnFactory.createPopupButton(ViewTasks.messages.BUTTON_ADD_TASK, 'bt-home-add-task')

		mainWrapper.appendChild viewWrapper
		
		return

ViewTasks.messages =
	BUTTON_ADD_TASK : 'Add new task'

module.exports = ViewTasks