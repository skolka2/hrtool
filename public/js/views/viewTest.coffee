ViewBase =  require './viewBase'
ComponentAddImplicitTask = require "../components/tasks/addTask/newImplicitTask/componentAddImplicitTask"
ComponentDeadlineInfo = require "../components/tasks/componentDeadlineInfo"

class ViewTest extends ViewBase
	constructor: ->
		super()


	render: ->
		super()
		mainWrapper = document.getElementById ViewBase.mainWrapper
		zibbyDiv = document.createElement "div"
		zibbyDiv.id = "zibby"

		component = new ComponentAddImplicitTask()
		div1 = document.createElement "div"
		div1.appendChild(document.createTextNode("text"))
		div2 = document.createElement "div"
		div2.appendChild(document.createTextNode("hover text"))
		component = new ComponentDeadlineInfo(new Date(2014, 10, 12, 0, 0, 0, 0))
		component2 = new ComponentDeadlineInfo(new Date())
		component3 = new ComponentDeadlineInfo(new Date(2015, 6, 6, 0, 0, 0, 0))
		component4 = new ComponentDeadlineInfo(new Date(2015, 6, 6, 0, 0, 0, 0), yes)
		component5 = new ComponentDeadlineInfo(new Date(2014, 6, 6, 0, 0, 0, 0), yes)
		component.render zibbyDiv
		zibbyDiv.appendChild(document.createElement("br"))
		component2.render zibbyDiv
		zibbyDiv.appendChild(document.createElement("br"))
		component3.render zibbyDiv
		zibbyDiv.appendChild(document.createElement("br"))
		component4.render zibbyDiv
		zibbyDiv.appendChild(document.createElement("br"))
		component5.render zibbyDiv

		mainWrapper.appendChild zibbyDiv
		return


module.exports = ViewTest