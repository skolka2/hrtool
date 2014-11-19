ViewBase =  require './viewBase'
ComponentSelectFactory = require "../components/features/componentSelectFactory"
ComponentPeopleExport = require "../components/componentPeopleExport"

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


		witzDiv = document.createElement "div"
		witzDiv.id = "witzDiv"

		componentPeopExp = new ComponentPeopleExport()
		componentPeopExp.render witzDiv

		mainWrapper.appendChild witzDiv

		return


module.exports = ViewTest