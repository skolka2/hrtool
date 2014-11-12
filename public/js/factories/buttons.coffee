ComponentPopupFactory = require  '../components/componentPopupFactory'

module.exports =
	create : (href, title, active)->
		a = document.createElement "a"
		a.href = href
		button = document.createElement "button"
		if active is href
			button.className = "bt-button active"
		else
			button.className = "bt-button"
		button.innerHTML = title
		a.appendChild button
		return a

	createPopupButton : (title, className, params)->
		button = document.createElement 'button'
		button.innerHTML = title
		button.className = 'bt-button ' + className
		button.addEventListener 'click', (ev) ->
				popup = ComponentPopupFactory.getNewTaskPopup(params)
				popup.open()
			, no
		return button

