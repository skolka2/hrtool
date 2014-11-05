ViewBase =  require './viewBase'
ComponentTemplateListFactory = require '../components/templateList/componentTemplateListFactory'

class ViewTemplates extends ViewBase
	constructor: ->
		super()

	render: ->
		super()
		
		mainWrapper = document.getElementById ViewBase.mainWrapper
		viewWrapper = document.createElement 'div'
		viewWrapper.className = "view-wraper"
		viewWrapper.innerHTML = "Implicit Tasks View"
		viewWrapper.appendChild document.createElement 'br'

		tableDiv = document.createElement 'div'
		tableDiv.innerHTML = "Table of template tasks"

		componentTemplateList = ComponentTemplateListFactory.createAll()
		componentTemplateList.render tableDiv

		viewWrapper.appendChild tableDiv
		viewWrapper.appendChild document.createElement 'br'

		mainWrapper.appendChild viewWrapper

		return

module.exports = ViewTemplates