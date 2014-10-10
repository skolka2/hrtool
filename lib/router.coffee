debug = require('debug') "hrtool:router"

module.exports = (app) ->
	registeredEndpoints = {}

	return {
		register: (name, next) ->
			if registeredEndpoints[name]
				throw new Error "Endpoint #{name} already exists!"
			registeredEndpoints[name] = yes
			app.io.route name, (req) ->
				debug "route begin - #{name}"
				next req, (err, data) ->
					if err
						debug("route error - #{name} \n",err)
						return req.io.respond({error: err})
					debug("route ok - #{name} \n")
					req.io.respond {data: data}
}