ComponentTaskImplicitNew = require './componentTaskImplicit'

ComponentTaskImplicitFactory =
	createAll: () ->
		componentTaskImplicitNew = new ComponentTaskImplicitNew()

module.exports = ComponentTaskImplicitFactory