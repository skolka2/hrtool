ComponentBase = require '../componentBase'

class ComponentTabbedArea extends ComponentBase
	constructor: (@_tabNames, componentsArray) ->
		super()
		@_currentTab = 0
		@_tabs = []
		@_divs = []

		for components, i in componentsArray
			@_divs.push document.createElement('div')
			@_divs[i].className = ComponentTabbedArea.UNSELECTED_TAB_DIV_CLASS
			for component, j in components
				name = "tabbedArea-#{@_tabNames[i]}-component-#{j}"
				@addChild name, component, {el: @_divs[i]}
		@_divs[0]?.className = ComponentTabbedArea.SELECTED_TAB_DIV_CLASS


	createDom: () ->
		@element = document.createElement 'div'
		divWrapper = document.createElement 'div'
		ul = document.createElement 'ul'

		@element.className = ComponentTabbedArea.WRAPPER_CLASS
		divWrapper.className = ComponentTabbedArea.DIVS_WRAPPER_CLASS
		ul.className = ComponentTabbedArea.TABS_CLASS

		for tabName, i in @_tabNames
			li = document.createElement 'li'
			a = document.createElement 'a'
			a.className = if (i is @_currentTab) then ComponentTabbedArea.SELECTED_TAB_CLASS else ComponentTabbedArea.UNSELECTED_TAB_CLASS
			a.div_index = i
			name = document.createTextNode tabName
			@_tabs.push a
	
			a.appendChild name
			li.appendChild a
			ul.appendChild li
			divWrapper.appendChild @_divs[i]

		@element.appendChild ul
		@element.appendChild divWrapper
		@element.addEventListener ComponentBase.CLICK_EVENT, @handleClickEvent, no
		return


	handleClickEvent: (ev) =>
		if ev.srcElement.div_index?
			@_divs[@_currentTab].className = ComponentTabbedArea.UNSELECTED_TAB_DIV_CLASS
			@_tabs[@_currentTab].className = ComponentTabbedArea.UNSELECTED_TAB_CLASS
			@_currentTab = ev.srcElement.div_index
			@_divs[@_currentTab].className = ComponentTabbedArea.SELECTED_TAB_DIV_CLASS
			@_tabs[@_currentTab].className = ComponentTabbedArea.SELECTED_TAB_CLASS
		return



	getSelectedTabNumber: () ->
		return @_currentTab






ComponentTabbedArea.WRAPPER_CLASS = 'tabbed-area'
ComponentTabbedArea.DIVS_WRAPPER_CLASS = 'box-wrap'
ComponentTabbedArea.TABS_CLASS = 'tabs'
ComponentTabbedArea.SELECTED_TAB_CLASS = 'tab-selected'
ComponentTabbedArea.UNSELECTED_TAB_CLASS = 'tab-unselected'
ComponentTabbedArea.SELECTED_TAB_DIV_CLASS = 'tab-div-selected'
ComponentTabbedArea.UNSELECTED_TAB_DIV_CLASS = 'tab-div-unselected'

module.exports = ComponentTabbedArea