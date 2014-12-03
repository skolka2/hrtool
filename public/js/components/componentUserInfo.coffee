ComponentBase = require './componentBase'


class ComponentUserInfo extends ComponentBase
	constructor: (@data) ->
		super()


	createDom :  ->
		###	@element = 	document.createElement 'div'
		@element.className = 'user-info-nav'###
		@element  =	@helper.tpl.create "components/componentUserInfo", @data
		@buddyDiv = @helper.tpl.create "components/componentBuddyInfo", @data
		@element.appendChild @buddyDiv
		@element.addEventListener ComponentBase.eventType.CLICK, @handleOnClick

	handleOnClick : =>
		@buddyDiv.className = 'buddy-active'

	render: (wrapper) ->
		unless @element
			@createDom()
		wrapper.appendChild @element

module.exports = ComponentUserInfo