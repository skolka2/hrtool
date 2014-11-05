app = require './app'
Router = require './router/router'
router = null

do ->
	$.get "/handshake", (data) ->
		if !data.error
			app.bulk = data.data
			router = new Router()
			router.init()
	if (!window.onhashchange?)
		window.onhashchange = ->
			if router? then router.changeView()
	else
		storedHash = window.location.hash
		window.setInterval () ->
			if window.location.hash != storedHash
				if router?
					router.changeView()
		, 100
	return