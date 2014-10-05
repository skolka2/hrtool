BaseComponent = require("./componentBase");
module.exports = class ComponentPopup extends BaseComponent

  constructor: (@triggerEl, @insideComponent) ->
    super
    @insideEl = @insideComponent.element
    @triggerEl.addEventListener 'click', @open.bind(@), false
    @rendered = false

  open: ->
    @mainDiv.classList.add 'popup-opened'
    @mainDiv.addEventListener 'click', @handleOuterClick.bind(@), false
    @fire 'popup_open', {}

  handleOuterClick: (ev) ->
    if ev.target is @mainDiv or ev.target is @container or ev.target is @closeCrossDiv
      @mainDiv.classList.remove 'popup-opened'

  close: ->
    @fire 'popup_close', {}

  createDom: ->
    @mainDiv = document.createElement 'div'
    @container = document.createElement 'div'
    @innerDiv = document.createElement 'div'
    @closeCrossDiv = document.createElement 'div'

    @mainDiv.className = 'popup-main'
    @container.className = 'popup-container'
    @innerDiv.className =  'popup-inner'
    @closeCrossDiv.className = 'popup-close-cross'

    @addChild 'popup_' + @insideComponent.componentId, @insideComponent, {'el': @innerDiv}

    @container.appendChild @innerDiv
    @container.appendChild @closeCrossDiv
    @mainDiv.appendChild @container
    
    @element = @mainDiv
