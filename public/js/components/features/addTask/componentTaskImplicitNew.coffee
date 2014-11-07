ComponentBase = require './../../componentBase'
ComponentImplicitTask = require './componentTaskImplicit'
Model = require '../../../models/model'
ComponentFilter = require './../componentFilter'
hrtool = require '../../../models/actions'
helper = require '../../../helpers/helpers'
ComponentFilterFormatter = require './../componentFilterFormatter'
ComponentContentSwitcher = require '../componentContentSwitcher'
ComponentFilter = require '../componentFilter'
ComponentRight = require './newTask/componentRight'

class ComponentTaskImplicitFactory extends ComponentBase
	constructor: () ->
		super()
		@_impicitTaskByTemplate = new ComponentImplicitTask()
		@_impicitTaskNew = new ComponentImplicitTask()
		@_rightComponent = new ComponentRight()
		@listen ComponentFilter.eventType.UPDATED, @_rightComponent, @handleOnChange
		@_impicitTaskNew.setAsNew()
		@_tabbedAreaComponent = new ComponentContentSwitcher	['New implicit task', 'Choose from template'],[[@_impicitTaskNew], [@_rightComponent,@_impicitTaskByTemplate]]
	handleOnChange: (ev) =>
		status = @_rightComponent.getStatus()
		@_impicitTaskByTemplate.handleChangedTemplateDataForImplicit status
	createDom: () ->
		tabbedAreaDiv = document.createElement 'div'
		tabbedAreaDiv.className = "tabbedArea"
		@addChild 'tabbedArea', @_tabbedAreaComponent, {el: tabbedAreaDiv}
		@element = tabbedAreaDiv
module.exports = ComponentTaskImplicitFactory