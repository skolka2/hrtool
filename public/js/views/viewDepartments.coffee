ViewBase =  require './viewBase'

class ViewDepartments extends ViewBase
	constructor: ->
		super()

	render: ->
		super()

		mainWrapper = document.getElementById ViewBase.mainWrapper
		viewWrapper = document.createElement 'div'
		viewWrapper.className = "view-wraper"
		viewWrapper.innerHTML = "Department Admin View"
		mainWrapper.appendChild viewWrapper
		
		return

module.exports = ViewDepartments