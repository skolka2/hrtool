ViewBase =  require './viewBase'
ComponentAddImplicitTask = require "../components/tasks/addTask/newImplicitTask/componentAddImplicitTask"

class ViewTest extends ViewBase
	constructor: ->
		super()


	render: ->
		super()
		mainWrapper = document.getElementById ViewBase.mainWrapper
		zibbyDiv = document.createElement "div"
		zibbyDiv.id = "zibby"

		component = new ComponentAddImplicitTask()
		component.render zibbyDiv

		mainWrapper.appendChild zibbyDiv



		witzDiv = document.createElement "div"
		witzDiv.id = "witz"

		button1 = document.createElement "p"
		button1.innerHTML = "Button1"
		button1.className = "button"
		witzDiv.appendChild button1

		button2 = document.createElement "p"
		button2.innerHTML = "Button2"
		button2.className = "button active"
		witzDiv.appendChild button2

		button3 = document.createElement "p"
		button3.innerHTML = "Button3"
		button3.className = "button confirm"
		witzDiv.appendChild button3

		mainWrapper.appendChild witzDiv
		return


module.exports = ViewTest