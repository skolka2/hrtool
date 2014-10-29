ViewBase =  require './viewBase'

class ViewTest extends ViewBase
	constructor: () ->
		super()


	render: () ->
		super arguments
		mainWrapper = document.getElementById ViewBase.mainWrapper
		div = document.createElement "div"
		div.id = "ViewDefault"
		div.innerText = "This is view for testing."
		mainWrapper.appendChild div
		return


module.exports = ViewTest