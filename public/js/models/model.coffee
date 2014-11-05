EventEmitter = require '../observer/ObservableComponent'

class Model extends EventEmitter
	constructor: (@eventType) ->
		super()
		@data = null

	update: (@data) ->
		@onUpdate()
		return

	onUpdate: ->
		@fire @eventType, @data
		return

module.exports = Model