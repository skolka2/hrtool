ViewBase =  require './viewBase'

class ViewDefault extends ViewBase
	constructor: ->
		super()

	render: ->
		super()		
		mainWrapper = document.getElementById ViewBase.mainWrapper
		div = document.createElement "div"
		div.id = "ViewDefault"
		div.innerText = "This is default view, you should not be seeing this (you should see other views instead)."
		mainWrapper.appendChild div
		return


module.exports = ViewDefault