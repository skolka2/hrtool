ComponentBase = require '../componentBase'
ComponentDropdown = require './componentDropdown'
helper = require '../../helpers/helpers'


class ComponentFilter extends ComponentBase
	constructor: (@_data, @_keys, searchable) ->
		super()
		@_status = []
		@_dropdowns = []
		searchable = if searchable then searchable else searchable = Array.apply(null, new Array(@_data.length)).map(Boolean.prototype.valueOf, false)
		for i in [0...@_data.length] by 1
			newDropdown = new ComponentDropdown @_initData(i), searchable[i]
			@_dropdowns.push newDropdown
			@_status.push newDropdown.selected
			@listen ComponentDropdown.EventType.CHANGE, newDropdown, @_filterData




	_initData: (i) ->
		data = @_data[i]
		selection = @_getSelection(i)

		return data[selection] if data[selection]

		keys = Object.keys data
		key = if keys.length > 0 then  keys[0] else ''

		keyLength = key.split('-').length
		keyLength = if keyLength is 1 and key.length is 0 then 0 else keyLength
		global = ''

		global += 'global-' for i in [0...keyLength] by 1

		global = global.substring(0, global.length - 1) if global.length > 0

		items = data[global] || ComponentDropdown.EmptyOption
		return items


	getStatus: () ->
		return @_status unless @_keys
		res = {}
		for item, i in @_keys
			res[item] = @_status[i]
		return res



	_filterData: (selected, src) ->
		for dropdown, i in @_dropdowns
			if src < dropdown.componentId
				selection = @_getSelection i
				data = @_data[i][selection]
				data = if data then data else ComponentDropdown.EmptyOption
				alreadyLoaded = data isnt ComponentDropdown.EmptyOption and data.filter((item) ->
						return item is dropdown.selected
					).length > 0
				unless alreadyLoaded
					dropdown.changeData data
					dropdown.setSelection ComponentDropdown.EmptyOption

				@_status[i] = dropdown.selected
				dropdown.setEnabled(data isnt ComponentDropdown.EmptyOption)
			else if src is dropdown.componentId
				if @_status[i] is selected
					return
				@_status[i] = selected

		@fire ComponentFilter.EventType.UPDATED, @getStatus()
		return



	_getSelection: (depth) ->
		selection = ''
		randomKey = Object.keys(@_data[depth])[0]
		if randomKey
			length = if randomKey is '' then 0 else randomKey.split("-").length
			for i in [0...length] by 1
				oneSelected = helper.obj.getData @_dropdowns[i], ['selected', 'id']
				selection += if oneSelected is -1 then 'global' else oneSelected
				selection += '-'

			selection = selection.substring 0, selection.length - 1 if selection.length > 0

		return selection



	createDom:  () ->
		mainDiv = document.createElement 'div'
		mainDiv.class = "filtrable-task"

		for dropdown in @_dropdowns
			@addChild 'dropdown' + dropdown.componentId, dropdown, {'el': mainDiv}

		@element = mainDiv
		return

	unselectAll: () ->
		firstDropdown = @_dropdowns[0]
		firstDropdown.setSelection ComponentDropdown.EmptyOption
		@_filterData ComponentDropdown.EmptyOption, firstDropdown.componentId
		return

	setActive: (active) ->
		dropdown.setEnabled active for dropdown in @_dropdowns
		return


ComponentFilter.EventType =
	UPDATED: 'new_selection'

module.exports = ComponentFilter