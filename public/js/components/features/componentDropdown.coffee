ComponentBase = require '../componentBase'
helper = require '../../helpers/helpers'
Const = require '../../helpers/constants'

class ComponentDropdown extends ComponentBase
	constructor: (@_data, useSearch) ->
		super()
		@selected = ''
		@_enabled = yes
		@searchEl = null
		@useSearch = no
		@_map = []
		if useSearch is null or @_data.length >= ComponentDropdown.SEARCH_FROM_ITEMS_COUNT then @useSearch = useSearch

		@_selectedTextElement = document.createElement 'div'
		@_selectedTextElement.id = 'component-' + @componentId + 'dropdown-button'
		@_selectedTextElement.className = 'dropdown-button ' + ComponentDropdown.State.ENABLED

		@_listEl = document.createElement 'ul'
		@_listEl.className = 'dropDownButton'
		@_listEl.style.visibility = 'hidden'

		@_selectedTextElement.addEventListener ComponentBase.eventType.CLICK, @_handleListOpen, no
		@changeData @_data

	_handleListOpen: () =>
		if @_enabled is yes
			if @_listEl.style.visibility is 'visible'
				@_listEl.style.visibility = 'hidden'
				if @useSearch is yes
					@searchEl.value = ""
					@handleSearch()
				return

			@_listEl.style.visibility = 'visible'

			@searchEl.focus() if @useSearch is yes

			onClick = (ev) =>
				if @getElement() is ev.target or @getElement().contains ev.target
					@_makeSelection ev, onClick
				else
					@_listEl.style.visibility = 'hidden'
					if @useSearch is yes
						@searchEl.value = ""
						@handleSearch()
					document.body.removeEventListener ComponentBase.eventType.CLICK, onClick, no
			document.body.addEventListener ComponentBase.eventType.CLICK, onClick, no
		return

	_fillWithData: (data) ->
		@_map = []
		if @useSearch is yes
			userInput = document.createElement 'input'
			userInput.setAttribute "type", "text"
			userInput.placeholder = "Search:"
			userInput.className = "dropDownItem userInput"

			@_listEl.appendChild userInput
			@searchEl = userInput
			@searchEl.addEventListener "keyup", @handleSearch

		@setEnabled no if data is ComponentDropdown.EmptyOption

		li = document.createElement 'li'
		li.className = 'dropDownItem deselector'
		li.innerHTML = "Clear..."
		empty = ComponentDropdown.EmptyOption
		@_map.push
			el: li
			value: empty
			searchValue: empty.value

		text = document.createTextNode ''
		li.appendChild text

		@_listEl.appendChild li
		@setSelection empty
		div = document.createElement 'div'
		div.className = 'dropdown-item-wrapper'

		for item in data
			li = document.createElement 'li'
			li.className = 'dropDownItem'
			@_map.push
				el: li
				value: item
				searchValue: helper.format.getUniversalString(item.value).toLowerCase().replace(/\s/g, "")

			text = document.createTextNode item.value
			li.appendChild text
			div.appendChild li

			@setSelection item if item.selected

		@_listEl.appendChild div
		return

	setSelection: (selectedItem) ->
		@selected = selectedItem
		if selectedItem.value is ''
			@_selectedTextElement.innerHTML = "Select..."
		else
			@_selectedTextElement.innerHTML = selectedItem.value
		@fire ComponentDropdown.eventType.CHANGE, @selected
		return


	setSelectionById: (id) ->
		for item in @_data
			if item.id is id
				@setSelection item
				break
		return

	setSelectionByValue: (value) ->
		for item in @_data
			if item.value is value
				@setSelection item
				break
		return



	getSelection: () ->
		return @selected


	changeData: (data) ->
		@_listEl.innerHTML = ""
		@_fillWithData data
		return


	_makeSelection: (src, onClick) ->
		selection = @_map.filter (item) ->
			return item.el is src.target

		if selection.length > 0 
			@setSelection selection[0].value
			@_listEl.style.visibility = 'hidden'
			document.body.removeEventListener ComponentBase.eventType.CLICK, onClick, no
			@fire ComponentDropdown.eventType.CHANGE, @selected
		return

		
		
	createDom: () ->
		@element = document.createElement "div"
		@element.id = 'component-' + @componentId
		@element.className = 'dropDownDiv'
	
		@element.appendChild @_selectedTextElement
		@element.appendChild @_listEl
		return




	setEnabled: (enabled) ->
		@_enabled = enabled;
		selection = @_selectedTextElement.classList
		if (enabled)
			selection.remove "disabled"
		else
			selection.add "disabled"

	getIsEnabled: () ->
		return @_enabled



	handleSearch: () =>
		if @searchEl.value.length > 0
			for item in @_map
				stringFromMap = item.searchValue
				stringFromInput = helper.format.getUniversalString(@searchEl.value).toLowerCase().replace(/\s/g, "")

				if stringFromMap.indexOf stringFromInput is -1
					item.el.style.display = "none"
				else
					item.el.style.display = "list-item"
		return

ComponentDropdown.eventType =
	CHANGE: 'dropdown-change'

ComponentDropdown.State =
	ENABLED: 'dropdown',
	DISABLED: 'dropdown disabled'


ComponentDropdown.EmptyOption =
	value: ""
	id: -1

ComponentDropdown.SEARCH_FROM_ITEMS_COUNT = 10

module.exports = ComponentDropdown