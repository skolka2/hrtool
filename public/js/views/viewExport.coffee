ViewBase = require './viewBase'

class ViewExport extends ViewBase
	constructor: ->
		super()

	render: ->
		super arguments
		mainWrapper = document.getElementById ViewBase.mainWrapper
		viewWrapper = document.createElement 'div'
		viewWrapper.className = "view-wraper"
		viewWrapper.innerHTML = "Exports view"
		mainWrapper.appendChild viewWrapper
		return

module.exports = ViewExport