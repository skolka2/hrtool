ComponentBase = require '../../componentBase'
helper = require '../../../helpers/helpers'

class ComponentLeftBase extends ComponentBase
  constructor: () ->
    super()
    @_status =
      title: ""
      description: ""
    @_title = null
    @_text = null

  createDom: () ->
    @element = document.createElement 'div'
    @element.className = 'add-task-wrapper'

    #Header
    labelDiv = document.createElement 'div'
    labelDiv.className = "add-task-header"
    labelDiv.innerText = 'Task'

    #Wrapper of task's title
    titleDiv = document.createElement "div"

    taskTitle = document.createElement 'span'
    taskTitle.className = "add-task-title-label"
    taskTitle.innerText = "Task title"

    titleDiv.appendChild taskTitle
    @_title = document.createElement 'input'
    @_title.id = @componentId + '-title'
    titleDiv.appendChild @_title

    #Wrapper of task's text
    textDiv = document.createElement "div"

    taskText = document.createElement 'span'
    taskText.className = 'add-task-text-label'
    taskText.innerText = 'Task description'

    textDiv.appendChild taskText
    @_text = document.createElement 'textarea'
    @_text.id = @componentId + '-text'
    textDiv.appendChild @_text

    @_selectorDiv = document.createElement 'div'
    @_selectorDiv.className = "add-task-selector"

    @element.appendChild labelDiv
    @element.appendChild titleDiv
    @element.appendChild textDiv


  getStatus: () ->
    @_status.title = @_title?.value
    @_status.description = @_text?.value
    return @_status


module.exports = ComponentLeftBase