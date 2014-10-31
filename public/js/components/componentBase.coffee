EventEmitter = require '../observer/ObservableComponent'
helper = require '../helpers/helpers'
Const = require '../helpers/constants'
ComponentNotificationCenter = require './componentNotificationCenter'

module.exports = class ComponentBase extends EventEmitter
	constructor: ->
		EventEmitter.apply @
		@super = EventEmitter
		@childs = {}
		@element = null
		@rendered = no
		@_invalidInputs = []
		@helper = helper
	addChild: (name,component,wraper) ->
		if @childs[name]
			console.log "Component with name: " + name + " already exists."
		else
			@childs[name] =
				component: component
				wrapper: wraper
			@setAsChild @childs[name].component
	removeChild: (name) ->
		if @childs[name] then delete @childs[name] else console.log "Component with name: " + name + " is not parent of this component."
	removeFromDOM: ->
		if @rendered
			@element.remove()
			@childs[child].component.removeFromDOM() for child of @childs
			@rendered = false
	destroy: ->
		@removeFromDOM()
		@removeListeners @componentId
		for name of @childs
			@childs[name].component.destroy()
			delete @childs[name]
	createDom: ->
		@element = document.createElement 'div'
		@element.id = 'component-' + @componentId
	getElement: ->
		@createDom() if !@element?
		return @element
	render: (parent) ->
		element = @getElement()
		parent = @getWrapper(parent)
		parent.appendChild element

		@rendered = true

		for name of @childs
			parentOfChild = element
			child = @childs[name]
			if child.wrapper
				if child.wrapper['el']
					parentOfChild = @helper.obj.getData child.wrapper, ['el']
				else if child.wrapper['id']
					parentOfChild = document.getElementById @helper.obj.getData child.wrapper, ['id']
				else if child.wrapper['class']
					parentOfChild = document.getElementsByClassName(@helper.obj.getData child.wrapper, ['class'])[0]
			child.component.render parentOfChild
	addNotification:(contentEl, duration, type) ->
		ComponentBase.NotificationCenter = new ComponentNotificationCenter() if !ComponentBase.NotificationCenter?
		ComponentBase.NotificationCenter.addNewNotification contentEl, duration, type
	getWrapper: (wrapper) ->
		if wrapper? then return wrapper else return document.getElementById ComponentBase.mainWrapper
	setModel: (@model, eventType) ->
		@listen eventType, model, @onLoad
	onLoad: (@data) ->
	setInvalidInputClass: (element) ->
		element = element || @element
		@_invalidInputs.push element
		element.classList.add Const.INVALID_INPUT_CLASS
		element.addEventListener ComponentBase.EventType.CLICK, @handleFocusEvent.bind @
	handleFocusEvent: (e) ->
		element = null
		for item,i in @_invalidInputs
			if item == e.currentTarget
				element = item
				@_invalidInputs.splice i , 0
				break
		element.classList.remove Const.INVALID_INPUT_CLASS
		element.removeEventListener ComponentBase.EventType.CLICK, @handleFocusEvent

	ComponentBase.mainWrapper = "main-wrapper"
	ComponentBase.INVALID_INPUT_CLASS = 'invalid-input'
	ComponentBase.EventType =
		CLICK: "click"
		CHANGE: "change"
		ONKEYPRESS: "keypress"
		KEYUP: 'keyup'
		BLUR: "blur"
		DOMContentLoaded: "DOMContentLoaded"
	ComponentBase.CLICK_EVENT = 'click'
	ComponentBase.NotificationCenter = null
	ComponentBase.DEFAULT_NOTIFICATION_DURATION = 3000