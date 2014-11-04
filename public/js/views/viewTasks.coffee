ViewBase =  require './viewBase'
ComponentAddTask = require '../components/features/addTask/newTask/componentAddTask'
ComponentHide = require '../components/features/componentHide'

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

		div = document.createElement 'div'
		component = new ComponentAddTask()
		component.render div
		hide = new ComponentHide @helper.dom.createElement("<span>Insert new task</span>"), div, no
		hide.render viewWrapper

		mainWrapper.appendChild viewWrapper
		
		return

module.exports = ViewTasks