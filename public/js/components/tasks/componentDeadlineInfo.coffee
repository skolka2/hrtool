ComponentBase = require '../componentBase'

class ComponentDeadlineInfo extends ComponentBase
	constructor: (@deadlineDate, @finishDate = new Date(), @isFinished = no) ->
		@isRed = if @deadlineDate <= new Date() then yes else no
		super()



	createDom: () ->
		@element = document.createElement 'div'
		@element.className = ComponentDeadlineInfo.classes.WRAPPER
		span = document.createElement 'span'
		span2 = document.createElement 'span'

		@contentDiv = document.createElement 'div'
		@contentDiv.classList.add ComponentDeadlineInfo.classes.CONTENT_DIV

		@hoverContentDiv = document.createElement 'div'
		@hoverContentDiv.classList.add ComponentDeadlineInfo.classes.HOVER_CONTENT_DIV
		@hoverContentDiv.style.opacity = '0'

		@circle = document.createElement 'div'
		@circle.className = if @isRed then ComponentDeadlineInfo.classes.RED_CIRCLE else ComponentDeadlineInfo.classes.CIRCLE

		@square = document.createElement 'div'
		@square.className = if @isRed then ComponentDeadlineInfo.classes.RED_SQUARE else ComponentDeadlineInfo.classes.SQUARE

		diff = @helper.format.getDiffDate new Date(), @deadlineDate
		date = @helper.format.getDate @deadlineDate
		if diff is 0
			@contentDiv.appendChild document.createTextNode 'Today'
			@contentDiv.classList.add 'white-bg'
			@circle.appendChild @contentDiv
		else
			if @isFinished is yes
				span2.innerHTML = 'Task Finished'
				date = @helper.format.getDate @finishDate
				if diff > 1
					@circle.classList.add 'correct' #task was finished before deadline
					@circle.innerHTML = '✔'
				else
					@circle.classList.add 'incorrect' #task was finished before deadline
					@circle.innerHTML = '✘'
			else
				span2.innerHTML = 'Task Deadline'
				span.innerHTML = Math.abs diff
				@contentDiv.appendChild span
				@contentDiv.appendChild document.createTextNode 'Days'
				@circle.appendChild @contentDiv

		@hoverContentDiv.appendChild span2
		@hoverContentDiv.appendChild document.createTextNode date

		@square.appendChild @hoverContentDiv

		@circle.addEventListener ComponentBase.eventType.MOUSE_OVER, (ev) =>
			@square.style.visibility = 'visible'
			@square.style.width = '120px'
			setTimeout =>
				@hoverContentDiv.style.opacity = '1'
			, 1200
		@circle.addEventListener ComponentBase.eventType.MOUSE_OUT, (ev) =>
			@hoverContentDiv.style.opacity = '0'
			@square.style.width = '0'
			@square.style.visibility = 'hidden'

		@element.appendChild @circle
		@element.appendChild @square
		return





ComponentDeadlineInfo.classes =
	WRAPPER: 'deadline-info'
	CIRCLE: 'circle'
	SQUARE: 'square'
	RED_CIRCLE: 'red-circle'
	RED_SQUARE: 'red-square'
	CONTENT_DIV: 'content-div'
	HOVER_CONTENT_DIV: 'hover-content-div'


module.exports = ComponentDeadlineInfo