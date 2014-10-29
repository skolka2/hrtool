ViewBase =  require './viewBase'
ComponentTemplateListFactory = require '../components/templateList/componentTemplateListFactory'

class ViewTemplateTasks extends ViewBase
	constructor: ->
		super()

	render: ->
		super arguments
		mainWrapper = document.getElementById ViewBase.mainWrapper
		viewWrapper = document.createElement 'div'
		viewWrapper.className = "view-wraper"
		viewWrapper.innerHTML = "Implicit Tasks View"
		viewWrapper.appendChild document.createElement 'br'

		tableDiv = document.createElement 'div'
		tableDiv.innerHTML = "Table of template tasks"

		componentTemplateList = new ComponentTemplateListFactory.createAll()
		componentTemplateList.render tableDiv

		viewWrapper.appendChild tableDiv
		viewWrapper.appendChild document.createElement 'br'

		mainWrapper.appendChild viewWrapper

		return

module.exports = ViewTemplateTasks