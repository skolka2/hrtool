EventEmitter = require '../observer/ObservableComponent'
helper = require '../helpers/helpers'
ComponentNavBar = require '../components/componentNavBar'

class ViewBase extends EventEmitter
	constructor: ->
		super()
		@helper = helper

	@mainWrapper = "main-wrapper"

	render: ->
		navBar = new ComponentNavBar()
		navBar.render()

		@base = document.getElementById ViewBase.mainWrapper

		if @base
			while @base.childNodes.length > 0
				@base.removeChild this.base.childNodes[0]
		else
			body = document.getElementsByTagName("body")[0]
			div = document.createElement "div"
			div.id = ViewBase.mainWrapper
			body.appendChild div

module.exports = ViewBase