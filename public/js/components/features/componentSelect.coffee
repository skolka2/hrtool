ComponentBase = require "../componentBase"
ComponentFilter = require "./componentFilter"
ComponentNotificationCenter = require "../componentNotificationCenter"
ComponentDropdown = require "../features/componentDropdown"


module.exports = class ComponentSelect extends ComponentBase
	constructor: (@data, @errorsInfo) ->
		super()

	createDom: ->
		@element = this.helper.tpl.create "components/features/componentSelect"

		selectorEl = @element.getElementsByClassName("selectors-wrapper")[0]

		cancelButton = @element.getElementsByClassName("select-button-cancel")[0]
		saveButton = @element.getElementsByClassName("select-button-save")[0]

		cancelButton.addEventListener ComponentBase.EventType.CLICK, @cancel, false
		saveButton.addEventListener ComponentBase.EventType.CLICK, @handleSave, false
		@filter = new ComponentFilter @data
		@addChild @filter.componentId, @filter, "el": selectorEl

	handleSave: =>
		if @isValid()
			@fire ComponentSelect.EventType.SAVE, @filter.getStatus()
			@reset()
			@cancel()

	reset: ->
		for dropdown in @filter._dropdowns
			dropdown.setSelection ComponentDropdown.EmptyOption
	isValid: ->
		isValid = yes
		baseTime = ComponentNotificationCenter.DEFAULT_TIME
		for item,i in @filter.getStatus()
			if item.id is -1
				@filter._dropdowns[i].setInvalidInputClass()
				if @errorsInfo[i]?
					@addNotification @errorsInfo[i], baseTime, ComponentNotificationCenter.EventType.error
					baseTime += 1000
				isValid = no
		return isValid

	cancel: =>
		@fire ComponentSelect.EventType.CANCEL, null

	ComponentSelect.EventType = {
	SAVE: 'selectSave',
	CANCEL: 'selectCancel'
	}