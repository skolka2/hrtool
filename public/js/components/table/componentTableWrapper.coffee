ComponentBase = require '../componentBase'
ComponentDropdown = require '../features/componentDropdown'
ComponentFilter = require '../features/componentFilter'
ComponentTextInput = require '../features/componentTextInput'
ComponentPopup = require '../componentPopup'

class ComponentTableWrapper extends ComponentBase
	constructor: (@_table, @_filterComponent, @_textInput) ->
		super()

	createDom: () ->
		@element = document.createElement 'div'
		@element.className = ComponentTableWrapper.WRAPPER_CLASS;

		topDiv = document.createElement 'div'
		topDiv.className = ComponentTableWrapper.TOP_DIV_CLASS
		@element.appendChild topDiv

		@addChild 'componentFilter', @_filterComponent, {el: topDiv}
		@addChild 'textInput', @_textInput, {el: topDiv}
		@addChild 'table', @_table, {el: @element}

		@listen ComponentFilter.eventType.UPDATED, @_filterComponent, @handleFilterTable
		@listen ComponentTextInput.eventType.INPUT_CHANGE, @_textInput, @handleFilterTable
		return

	handleFilterTable: () =>
		status1 = @_filterComponent.getStatus()
		filterData = {}

		for item, i in status1
			if item.id isnt -1
				filterData['filter' + (i + 1)] = item.id
			else
				delete filterData['filter' + (i + 1)]

		name = @_textInput.getStatus()
		filterData.input = '%' + name + '%' if name

		filterData = null if Object.keys(filterData).length <= 0
		@_table.setFilterData filterData
		@_table.handleOnFilter()
		return


ComponentTableWrapper.WRAPPER_CLASS = 'filter-table'
ComponentTableWrapper.TOP_DIV_CLASS = 'filter-table-top_div'

module.exports = ComponentTableWrapper