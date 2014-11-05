ComponentBase = require '../componentBase'

class ComponentTaskList extends ComponentBase
	constructor: (@taskDetailSelection) ->
		super()
		@data = [];
		return

	onLoad: (data) ->
		if data.length > 0
			@data = data
			@addTasks()
		else
			@clearContent()
			@setNoTasks()
		return

	addTasks: ->
		@clearContent()

		for taskData in @data
			taskDataModified =
				taskId: taskData.id_task
				taskOwner: taskData.user_email
				taskBuddy: taskData.buddy_email
				taskTitle: taskData.title
				dateFrom: taskData.date_from
				dateTo: taskData.date_to
				taskDescription: taskData.description
				taskNotes: taskData.notes
				isFinished: taskData.completed

			task = @taskDetailSelection taskDataModified

			task.render @content if @rendered

			@addChild "task"+taskDataModified.taskId, task, 'el': @content

		return

	createDom: ->
		@content = document.createElement 'div'
		@content.className = "task-list-content"
		@element = @content
		return

	clearContent: ->
		for name of @childs
			@childs[name].component.destroy();
			@removeChild name

		@content.innerHTML = '';
		return

	setNoTasks: ->
		infoText = document.createElement 'h3'
		infoText.innerText = 'No tasks to be displayed...'
		@content.appendChild (infoText)
		return

ComponentTaskList.eventType =
	buddy:
		DATA_LOAD_COMPLETED: 'tasks/buddy/list/completed'
		DATA_LOAD_NOT_COMPLETED: 'tasks/buddy/list/not-completed'
	user:
		DATA_LOAD_COMPLETED: 'tasks/user/list/completed'
		DATA_LOAD_NOT_COMPLETED: 'tasks/user/list/not-completed'
	manager:
		DATA_LOAD_COMPLETED: 'tasks/teams/list/completed'
		DATA_LOAD_NOT_COMPLETED: 'tasks/teams/list/not-completed'

module.exports = ComponentTaskList