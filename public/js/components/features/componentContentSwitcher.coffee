ComponentBase = require '../componentBase'

class ComponentContentSwitcher extends ComponentBase
	constructor: (@_tabNames, componentsArray) ->
		super()
		@_currentTab = 0
		@_tabs = []
		@_divs = []

		for components, i in componentsArray
			@_divs.push document.createElement('div')
			@_divs[i].className = ComponentContentSwitcher.UNSELECTED_TAB_DIV_CLASS
			for component, j in components
				name = "tabbedArea-#{@_tabNames[i]}-component-#{j}"
				@addChild name, component, {el: @_divs[i]}
		@_divs[0]?.className = ComponentContentSwitcher.SELECTED_TAB_DIV_CLASS


	createDom: () ->
		@element = document.createElement 'div'
		divWrapper = document.createElement 'div'
		ul = document.createElement 'ul'

		@element.className = ComponentContentSwitcher.WRAPPER_CLASS
		divWrapper.className = ComponentContentSwitcher.DIVS_WRAPPER_CLASS
		ul.className = ComponentContentSwitcher.TABS_CLASS

		for tabName, i in @_tabNames
			li = document.createElement 'li'
			a = document.createElement 'a'
			a.className = if (i is @_currentTab) then ComponentContentSwitcher.SELECTED_TAB_CLASS else ComponentContentSwitcher.UNSELECTED_TAB_CLASS
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
			@_divs[@_currentTab].className = ComponentContentSwitcher.UNSELECTED_TAB_DIV_CLASS
			@_tabs[@_currentTab].className = ComponentContentSwitcher.UNSELECTED_TAB_CLASS
			@_currentTab = ev.srcElement.div_index
			@_divs[@_currentTab].className = ComponentContentSwitcher.SELECTED_TAB_DIV_CLASS
			@_tabs[@_currentTab].className = ComponentContentSwitcher.SELECTED_TAB_CLASS
		return



	getSelectedTabNumber: () ->
		return @_currentTab






ComponentContentSwitcher.WRAPPER_CLASS = 'tabbed-area'
ComponentContentSwitcher.DIVS_WRAPPER_CLASS = 'box-wrap'
ComponentContentSwitcher.TABS_CLASS = 'tabs'
ComponentContentSwitcher.SELECTED_TAB_CLASS = 'tab-selected'
ComponentContentSwitcher.UNSELECTED_TAB_CLASS = 'tab-unselected'
ComponentContentSwitcher.SELECTED_TAB_DIV_CLASS = 'tab-div-selected'
ComponentContentSwitcher.UNSELECTED_TAB_DIV_CLASS = 'tab-div-unselected'

module.exports = ComponentContentSwitcher