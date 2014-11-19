ComponentBase = require "../componentBase"

class ComponentHoverInfo extends ComponentBase
	constructor: (@deadlineDate) ->
		@isRed = if @deadlineDate <= new Date() then yes else no
		super()



	createDom: () ->
		@element = document.createElement "div"
		@element.className = ComponentHoverInfo.classes.WRAPPER
		span = document.createElement "span"
		span2 = document.createElement "span"

		@contentDiv = document.createElement "div"
		@contentDiv.classList.add ComponentHoverInfo.classes.CONTENT_DIV

		@hoverContentDiv = document.createElement "div"
		@hoverContentDiv.classList.add ComponentHoverInfo.classes.HOVER_CONTENT_DIV
		@hoverContentDiv.style.opacity = "0"

		@circle = document.createElement "div"
		@circle.className = if @isRed then ComponentHoverInfo.classes.RED_CIRCLE else ComponentHoverInfo.classes.CIRCLE

		@square = document.createElement "div"
		@square.className = if @isRed then ComponentHoverInfo.classes.RED_SQUARE else ComponentHoverInfo.classes.SQUARE

		diff = @helper.format.getDiffDate(new Date(), @deadlineDate)
		if diff is 0
			@contentDiv.appendChild document.createTextNode("Today")
		else
			span.innerHTML = diff - 1
			@contentDiv.appendChild span
			@contentDiv.appendChild document.createTextNode("Days")

		span2.innerHTML = "Task Deadline"
		@hoverContentDiv.appendChild span2
		@hoverContentDiv.appendChild document.createTextNode(@helper.format.getDate(@deadlineDate))

		@circle.appendChild @contentDiv
		@square.appendChild @hoverContentDiv

		@circle.addEventListener ComponentBase.eventType.MOUSE_OVER, (ev) =>
			@square.style.visibility = "visible"
			@square.style.width = "120px"
			setTimeout () =>
				@hoverContentDiv.style.opacity = "1"
			, 1200
		@circle.addEventListener ComponentBase.eventType.MOUSE_OUT, (ev) =>
			@hoverContentDiv.style.opacity = "0"
			@square.style.width = "0"
			@square.style.visibility = "hidden"

		@element.appendChild @circle
		@element.appendChild @square
		return





ComponentHoverInfo.classes =
	WRAPPER: "hover-info"
	CIRCLE: "circle"
	SQUARE: "square"
	RED_CIRCLE: "red-circle"
	RED_SQUARE: "red-square"
	CONTENT_DIV: "content-div"
	HOVER_CONTENT_DIV: "hover-content-div"


module.exports = ComponentHoverInfo