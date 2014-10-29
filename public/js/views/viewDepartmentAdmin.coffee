ViewBase =  require './viewBase'

class ViewDepartmentAdmin extends ViewBase
	constructor: ->
		super()

	render: ->
		super arguments
		mainWrapper = document.getElementById ViewBase.mainWrapper
		viewWrapper = document.createElement 'div'
		viewWrapper.className = "view-wraper"
		viewWrapper.innerHTML = "Department Admin View"
		mainWrapper.appendChild viewWrapper
		return

module.exports = ViewDepartmentAdmin