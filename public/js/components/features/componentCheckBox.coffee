ComponentBase = require '../componentBase'


class ComponentCheckBox extends ComponentBase
	constructor: (@labelText = '', @checked) ->
		super()
		
	createDom: ()->
		buddyCheckbox = document.createElement "div"
		buddyCheckbox.className =  "buddy-checkbox"
		buddyCheckbox.id = "buddy-checkbox" + @componentId
	
		@checkChecked = document.createElement "div"
	
		@_setCheckClass()
	
		@label = document.createElement "div"
		@label.className = "checkbox-label"
	
		@label.innerText = @labelText
	
		buddyCheckbox.appendChild @checkChecked
		buddyCheckbox.appendChild @label
	
		@element = buddyCheckbox
	
		@element.addEventListener ComponentBase.eventType.CLICK ,@handleOnClick, no
		return



	_setCheckClass: () ->
		@checkChecked.className = if @checked then ComponentCheckBox.checkBoxClass.CHECKED else ComponentCheckBox.checkBoxClass.NOTCHECKED
		return

	handleOnClick: () =>
		@setChecked !@checked
		return

	setCheckBoxTittle: (tittle) ->
		@labelText = tittle
		@label.innerText = tittle
		return


	setChecked: (checked) ->
		@getElement()
		@checked = checked
		@_setCheckClass()
		@fire ComponentBase.eventType.CHANGE, @checked
		return

	isChecked: () ->
		return @checked





ComponentCheckBox.checkBoxClass =
	CHECKED: "checkbox checked"
	NOTCHECKED: "checkbox"

module.exports = ComponentCheckBox