ComponentBase = require '../../../componentBase'
ComponentFilterFormatter = require '../../componentFilterFormatter'
ComponentFilter = require '../../componentFilter'
hrtool = require '../../../../models/actions'
Model = require '../../../../models/model'

class ComponentRight extends ComponentBase
	constructor: ->
		super();
		@setModel new Model(ComponentRight.eventType.GET_USERS), ComponentRight.eventType.GET_USERS
		hrtool.actions.getTemplatesData @model

	onLoad: (templates) ->
		@_templates = templates
		departments = @helper.bulk.getData ['departments']
		teams = @helper.bulk.getData ['teams']
		data = ComponentFilterFormatter.factory.createTemplateDropdownsData departments, teams, templates

		@_componentFilter = new ComponentFilter data, ['department', 'team', 'task_template']
		@addChild 'componentFilter', @_componentFilter, {el: @element}
		@_componentFilter.render @element

	createDom: ->
		@element = document.createElement 'div'
		@element.className = ComponentRight.WRAPPER_CLASS

		headline = document.createElement 'span'
		headline.className = ComponentRight.HEADLINE_CLASS
		headline.innerHTML = 'Choose saved task'
		@element.appendChild headline

	getSelectedTemplate: (id) ->
		for template in @_templates
			return template if template.id_task_template is id


	getStatus: ->
		return @_componentFilter.getStatus()


ComponentRight.WRAPPER_CLASS = 'task-template-div'
ComponentRight.HEADLINE_CLASS = 'task-template-headline'
ComponentRight.eventType =
	GET_DATA: 'template/get-all'

module.exports = ComponentRight