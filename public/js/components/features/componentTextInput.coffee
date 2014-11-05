ComponentBase = require '../componentBase'

class ComponentTextInput extends ComponentBase
	constructor: (@placeholder) ->
		super()
		@fired = false

	createDom: () ->
		@element = document.createElement 'div'
		@element.className = ComponentTextInput.WRAPPER_CLASS

		@_input = document.createElement 'input'
		@_input.placeholder = @placeholder
		@_input.addEventListener ComponentBase.eventType.KEYUP, @handleKeyupEvent, false

		@_deleteDiv = document.createElement 'div'
		@_deleteDiv.className = ComponentTextInput.DELETE_DIV_CLASS
		@_deleteDiv.appendChild document.createTextNode 'X'
		@_deleteDiv.addEventListener ComponentBase.eventType.CLICK, @handleDeleteClick, false

		@element.appendChild @_input
		@element.appendChild @_deleteDiv
		return

	handleDeleteClick: (ev) =>
		@_input.value = ''
		@fire ComponentTextInput.eventType.INPUT_CHANGE, @_input.value
		return


	handleKeyupEvent: (ev) =>
		@_oldValue = @_input.value;
		setTimeout @checkTyping, ComponentTextInput.DELAY
		@fired = false if @fired
		return

	checkTyping: () =>
		if @fired is false and @_oldValue is @_input.value
			@fire ComponentTextInput.eventType.INPUT_CHANGE, @_oldValue
			@fired = true
		return

	getStatus: () ->
		return @_input.value



ComponentTextInput.WRAPPER_CLASS = 'text-input'
ComponentTextInput.DELETE_DIV_CLASS = 'text-input-delete'
ComponentTextInput.DELAY = 500
ComponentTextInput.eventType =
	INPUT_CHANGE: 'input-change'

module.exports = ComponentTextInput