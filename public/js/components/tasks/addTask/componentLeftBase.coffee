ComponentBase = require '../../componentBase'
helper = require '../../../helpers/helpers'

class ComponentLeftBase extends ComponentBase
  constructor: ->
    super()
    @_status =
      title: ''
      description: ''
    @_titleEL = null
    @_descriptionEl = null

  createDom: ->
    @element = document.createElement 'div'
    @element.className = 'add-task-wrapper'

    #Header
    labelDiv = document.createElement 'div'
    labelDiv.className = 'add-task-header'
    labelDiv.innerText = 'Task'

    #Wrapper of task's title
    titleDiv = document.createElement 'div'

    taskTitle = document.createElement 'span'
    taskTitle.className = 'add-task-title-label'
    taskTitle.innerText = 'Task title'

    titleDiv.appendChild taskTitle
    @_titleEL = document.createElement 'input'
    @_titleEL.id = @componentId + '-title'
    titleDiv.appendChild @_titleEL

    #Wrapper of task's text
    textDiv = document.createElement 'div'

    taskText = document.createElement 'span'
    taskText.className = 'add-task-text-label'
    taskText.innerText = 'Task description'

    textDiv.appendChild taskText
    @_descriptionEl = document.createElement 'textarea'
    @_descriptionEl.id = @componentId + '-text'
    textDiv.appendChild @_descriptionEl

    @_selectorDiv = document.createElement 'div'
    @_selectorDiv.className = 'add-task-selector'

    @element.appendChild labelDiv
    @element.appendChild titleDiv
    @element.appendChild textDiv


  getStatus: ->
    @_status.title = @_titleEL?.value
    @_status.description = @_descriptionEl?.value
    return @_status

  getTitleInput: ->
    return @_titleEL

  getDescriptionInput: ->
    return @_descriptionEl

module.exports = ComponentLeftBase