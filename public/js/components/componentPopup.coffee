ComponentBase = require "./componentBase"
module.exports = class ComponentPopup extends ComponentBase

	constructor: (@triggerEl, @insideComponent) ->
		super()
		@insideEl = @insideComponent.element
		@triggerEl.addEventListener ComponentBase.CLICK_EVENT, @open, no
		@rendered = no

	open: =>
		popups = document.getElementsByClassName 'popup-container'
		for popup in popups
			popup.style.display = 'none'

		@mainDiv.classList.add 'popup-opened'
		@container.style.display = 'block'
		@mainDiv.addEventListener ComponentBase.CLICK_EVENT, @handleOuterClick, no
		@fire ComponentPopup.eventType.OPEN, {}

	handleOuterClick: (ev) =>
		@mainDiv.classList.remove 'popup-opened' if not @innerDiv.contains ev.target

	close: ->
		@fire ComponentPopup.eventType.CLOSE, {}

	createDom: ->
		@mainDiv = document.getElementById 'popup-wrapper'
		@container = document.createElement 'div'
		@innerDiv = document.createElement 'div'
		@closeCrossDiv = document.createElement 'div'
		@container.className = 'popup-container'
		@innerDiv.className =	'popup-inner'
		@closeCrossDiv.className = 'popup-close-cross'

		@addChild 'popup_' + @insideComponent.componentId, @insideComponent, {'el': @innerDiv}

		@container.appendChild @innerDiv
		@container.appendChild @closeCrossDiv

		@element = @container

	ComponentPopup.eventType =
		CLOSE: 'popup_close'
		OPEN: 'popup-open'
