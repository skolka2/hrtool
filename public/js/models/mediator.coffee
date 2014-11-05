class Mediator

	getSocket: ->
		Mediator.socket = io.connect() unless Mediator.socket
		Mediator.socket

	loadData: (endpoint, params, model, transform) ->
		@getSocket().emit endpoint, params, (resp) ->
			if resp.error
				console.log "error: ", resp.error
				model.update resp.error
				return
			else
				resp.data = transform resp.data if transform
				model.update resp.data
				return
		return

module.exports = Mediator