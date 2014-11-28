class ComponentNotificationCenter
	constructor: ->
		@_countOfNotifications = 0
		@render document.getElementById('navbar')


	addNewNotification: (element, duration, type) ->
		if typeof element is "string"
			wrapper = document.createElement 'div'
			wrapper.innerHTML = element
			element = wrapper
	
		newDiv = document.createElement 'div'
		newDiv.className = if type? then type else ComponentNotificationCenter.eventType.NEUTRAL
		newDiv.appendChild element
		@_countOfNotifications++

		if @_countOfNotifications is 1
			setTimeout () =>
				@element.classList.remove 'deactivated'
			, 0
		@element.appendChild newDiv
		setTimeout () =>
			return @_hide newDiv
		, duration
		return


	_hide: (newDiv) ->
		@_countOfNotifications--
		unless @_countOfNotifications
			@element.classList.add "deactivated"
		@element.removeChild newDiv
		return



	createDom: ->
		wrapper = document.createElement 'div'
		wrapper.className = "notification-center deactivated"
		@element = wrapper
		return


	render: (wrapper) ->
		unless @element
			@createDom()
		wrapper.appendChild @element


	isOpened: ->
		return !!@_countOfNotifications


ComponentNotificationCenter.eventType =
	SUCCESS: 'notification-success'
	NEUTRAL: 'notification-neutral'
	ERROR: 'notification-error'

ComponentNotificationCenter.DEFAULT_TIME = 3000

module.exports = ComponentNotificationCenter