RouterConfig = require './routerConfig'
ViewBase = require '../views/viewBase'
ComponentBase = require '../components/componentBase'

class Router

	init: ->
		@routerConfig = new RouterConfig()
		@changeView()
		return

	getPath: ->
		url = window.location.hash

		output =
			view: ""
			parameters: ""

		if url isnt ""
			map = {}
			arr = url.split '?'

			if(arr[1])
				params = arr[1]
				vars = params.split "&"

				for v in vars
					pair = v.split "="
					map[pair[0]] = pair[1]

				output['parameters'] = map

			index = arr[0].lastIndexOf('#')
			output['view'] = arr[0].substring index+1

		output

	changeView: ->
		@view = @routerConfig.setView @getPath()
		mainWrapper = document.getElementById ViewBase.mainWrapper

		if mainWrapper
			mainWrapper.innerHTML = ''
			@view.render()

		else
			document.addEventListener ComponentBase.eventType.DOMContentLoaded, =>
				document.removeEventListener ComponentBase.eventType.DOMContentLoaded, arguments.callee, no
				if mainWrapper
					mainWrapper.innerHTML = ''
					@view.render()
			, no

		return

module.exports = Router