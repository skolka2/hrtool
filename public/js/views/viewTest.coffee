ViewBase =  require './viewBase'
ComponentSelectFactory = require "../components/features/componentSelectFactory"

class ViewTest extends ViewBase
	constructor: () ->
		super()


	render: () ->
		super()
		mainWrapper = document.getElementById ViewBase.mainWrapper
		zibbyDiv = document.createElement "div"
		zibbyDiv.id = "zibby"

		component = ComponentSelectFactory.createDepartmentTeam()
		component.render zibbyDiv

		mainWrapper.appendChild zibbyDiv
		return


module.exports = ViewTest