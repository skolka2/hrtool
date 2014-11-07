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
		filterData =
			filter : []

		for item, i in status1
			if item.id isnt -1
				filterData.filter.push item.id
			else
				filterData.filter.splice(i+1,i+1)

		name = @_textInput.getStatus()
		filterData.input = '%' + name + '%' if name

		filterData = null if Object.keys(filterData).length <= 1 and filterData.filter.length <=0
		@_table.handleOnFilter(filterData)
		return


ComponentTableWrapper.WRAPPER_CLASS = 'filter-table'
ComponentTableWrapper.TOP_DIV_CLASS = 'filter-table-top_div'

module.exports = ComponentTableWrapper