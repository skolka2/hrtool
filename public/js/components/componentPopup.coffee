ComponentBase = require "./componentBase"

class ComponentPopup extends ComponentBase

#	TODO remove @triggerEl argument and never use render

	constructor: (@insideComponent) ->
		super()
		@insideEl = @insideComponent.element
		@rendered = no
		@mainDiv = document.getElementById 'popup-wrapper'
		@opened = no
		return

	open: (ev) =>
		@_prepare()
		@opened = yes
		@mainDiv.classList.add 'popup-opened'
		@container.style.display = 'block'
		@fire ComponentPopup.eventType.OPEN, {}
		@handleOuterClickFn = (ev) =>
			if @innerDiv? and not @innerDiv.contains ev.target
				@close()
			return
		@mainDiv.addEventListener ComponentBase.CLICK_EVENT, @handleOuterClickFn, no
		return

	close: ->
		@container.style.display = 'none'
		@insideComponent.destroy()
		@mainDiv.removeEventListener ComponentBase.CLICK_EVENT, @handleOuterClickFn, no
		@mainDiv.classList.remove 'popup-opened'
		while @mainDiv.firstChild
			@mainDiv.removeChild @mainDiv.firstChild
		@fire ComponentPopup.eventType.CLOSE, {}
		return

	createDom: ->

	_prepare: ->
		@container = document.createElement 'div'
		@container.className = 'popup-container'
		@innerDiv = document.createElement 'div'
		@innerDiv.className = 'popup-inner'
		@closeCrossDiv = document.createElement 'div'
		@closeCrossDiv.className = 'popup-close-cross'

		@addChild 'popup_' + @insideComponent.componentId, @insideComponent
		@insideComponent.render @innerDiv

		@container.appendChild @innerDiv
		@container.appendChild @closeCrossDiv

		@element = @container
		@mainDiv.appendChild @container
		return


ComponentPopup.eventType =
	CLOSE: 'popup_close'
	OPEN: 'popup-open'

module.exports = ComponentPopup
