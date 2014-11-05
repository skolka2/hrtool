ComponentBase = require '../componentBase'

class ComponentHide extends ComponentBase
	constructor: (@headlineEl, @content, @closed = false) ->
		super()
		@headTitle = null
		@arrow = null
		@contentEl = @content
		
	createDom: () ->
		wrapper = document.createElement "div"
		wrapper.className = "hide-comp"
	
		head =  document.createElement "div"
		head.className = "hide-head"
	
		@headTittle = document.createElement "div"
		@headTittle.className = "hide-tittle"
	
		@setHeader @headlineEl
	
		@arrow = document.createElement "div"
		@arrow.className = "hide-arrow"
		@arrow.addEventListener ComponentBase.eventType.CLICK, @handleHide, no
	
		head.appendChild @headTittle
		head.appendChild @arrow
	
		@setContent @contentEl
		wrapper.appendChild head
		wrapper.appendChild @content
	
		@element = wrapper
		@setVisibility @closed
		return

	handleHide: () =>
		@closed = !@closed
	
		@setVisibility @closed
		if @closed is yes
			@fire ComponentHide.eventType.REMOVE, @componentId
		else
			@fire ComponentHide.eventType.RENDER, @componentId
		return



	setVisibility: (show) ->
		unless show
			@content.className = "hide-content"
			@arrow.innerHTML = "<span>HIDE</span><div>" + ComponentHide.Arrows.DOWN + "</div>"
		else
			@content.className = "hide-content hidden"
			@arrow.innerHTML = "<span>SHOW</span><div>" + ComponentHide.Arrows.UP + "</div>"
		return



	setContent: (content) ->
		if @content?
			@content = document.createElement "div"
			@content.className = 'hide-content'
		else
			while @content.firstChild isnt null
				@content.removeChild @content.firstChild
		@content.appendChild content
		return


	setHeader: (header) ->
		while @headTittle.firstChild?
			@headTittle.removeChild @headTittle.firstChild
		@headTittle.appendChild header


	getContentWrapper: () ->
		@getElement()
		return @content




	render: (wrapper) ->
		super wrapper
		if @closed is yes
			@setVisibility @closed
		return




ComponentHide.eventType =
	REMOVE:"childsRemoved"
	RENDER:"childsRendered"


ComponentHide.Arrows =
	UP: "&#8744"
	DOWN: "&#8743"

module.exports = ComponentHide