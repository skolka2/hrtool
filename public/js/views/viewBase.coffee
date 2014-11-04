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

		baseEl = document.getElementById ViewBase.mainWrapper

		if baseEl
			while baseEl.childNodes.length > 0
				baseEl.removeChild this.baseEl.childNodes[0]
		else
			body = document.getElementsByTagName("body")[0]
			div = document.createElement "div"
			div.id = ViewBase.mainWrapper
			body.appendChild div

		return

module.exports = ViewBase