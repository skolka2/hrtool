ComponentTemplateList = require './componentTemplateList'
Model = require '../../models/model'
hrtool = require '../../models/actions'

ComponentTemplateListFactory  =
	createAll: ->
		componentTemplateList = new ComponentTemplateList()
		componentTemplateList.setModel new Model(ComponentTemplateList.eventType.DATA_LOAD), ComponentTemplateList.eventType.DATA_LOAD
		hrtool.actions.getTemplatesData componentTemplateList.model
		return componentTemplateList

module.exports = ComponentTemplateListFactory