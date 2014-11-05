Observer = require './Observer'

class EventEmitter
	constructor: ->
		@componentId = ++EventEmitter._componentId

	@_componentId = 0

	@getObserver: ->
		EventEmitter.observer = new Observer() unless EventEmitter.observer
		EventEmitter.observer

	listen: (type, src, fn) ->
		fn = fn.bind @
		EventEmitter.getObserver().on type, fn, src
		return

	fire: (type, data) ->
		EventEmitter.getObserver().fire type, data, this.componentId
		return

	setAsChild: (child) ->
		EventEmitter.getObserver().mapOfComponents[child.componentId] = this.componentId
		return

	removeListeners: (componentId) ->
		delete EventEmitter.getObserver().mapOfComponents[componentId] if EventEmitter.getObserver().mapOfComponents[componentId]
		EventEmitter.getObserver().removeListener componentId
		return

module.exports = EventEmitter