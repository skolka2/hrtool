ComponentBase = require '../../componentBase'
ComponentBaseTaskDetail = require './componentBaseTaskDetail'
ComponentNotificationCenter = require '../../componentNotificationCenter'
Model = require '../../../models/model'
hrtool = require '../../../models/actions'

class ComponentUserTaskDetail extends ComponentBaseTaskDetail
	constructor: (taskParams) ->
		super taskParams
		@taskBuddy = taskParams.taskBuddy
		return

	createDom: ->
		super

		buddyLabel = (@element.getElementsByClassName ComponentBaseTaskDetail.taskClasses.BUDDY_LABEL_CLASS)[0]
		headerWrapper = (@element.getElementsByClassName ComponentBaseTaskDetail.taskClasses.HEADER_WRAPPER_CLASS)[0]
		footerWrapper = (@element.getElementsByClassName ComponentBaseTaskDetail.taskClasses.FOOTER_WRAPPER_CLASS)[0]

		headerWrapper.removeChild buddyLabel
		footerWrapper.appendChild buddyLabel

		@finishTaskBttnNo = @createButton "finish-task-bttn", "No", @handleFinishTaskCanceled, "none"
		footerWrapper.appendChild @finishTaskBttnNo

		@finishTaskBttnYes = @createButton "finish-task-bttn", "Yes", @handleFinishTaskConfirmed, "none"
		footerWrapper.appendChild @finishTaskBttnYes

		@finishTaskBttn = @createButton "finish-task-bttn", "Finish task", @handleFinishTask
		footerWrapper.appendChild @finishTaskBttn

		@finishTaskBttn.disabled = yes if @isFinished

		@saveNotesBttn = @createButton "save-notes-bttn", "Save notes", @handleSaveNotes
		footerWrapper.appendChild @saveNotesBttn

		return

	setNotes: ->
		@notesElement = document.createElement 'textarea'
		@notesElement.className = "notes-text-area"
		@notesElement.innerHTML = @taskNotes
		@notesElement.addEventListener ComponentBase.EventType.CLICK, this.handleTextAreaEnable
		@notesElement.readonly = yes
		return

	createButton: (buttonClass, buttonText, handleFunction, styleDisplay) ->
		buttonElement = document.createElement 'button'
		buttonElement.className = buttonClass
		buttonElement.innerHTML = buttonText
		buttonElement.addEventListener ComponentBase.EventType.CLICK, handleFunction
		buttonElement.style.display = styleDisplay if styleDisplay
		buttonElement

	handleSaveNotes: (ev) =>
		if @notesElement.value is @taskNotes
			notification = document.createElement 'div'
			notification.innerHTML = "Nothing has been changed."
			@addNotification notification, ComponentNotificationCenter.DEFAULT_TIME, ComponentNotificationCenter.EventType.neutral
		else
			@saveNotesBttn.disabled = yes
			@notesElement.readonly = yes
			@taskNotes = @notesElement.value

			dataToSend =
				id_task: @taskId
				notes: @taskNotes

			model = new Model ComponentUserTaskDetail.EventType.DATA_UPDATE
			@listen ComponentUserTaskDetail.EventType.DATA_UPDATE, model, @saveNotesConfirmed
			hrtool.actions.updateUserTaskData model, dataToSend

		return

	saveNotesConfirmed: ->
		@saveNotesBttn.disabled = no
		notification = document.createElement 'div'
		notification.innerHTML = 'Save succesfull.'
		@addNotification notification, ComponentNotificationCenter.DEFAULT_TIME, ComponentNotificationCenter.EventType.success
		return

	handleFinishTask: (ev) =>
		@setButtonsDisplay yes unless @isFinished
		return

	handleFinishTaskConfirmed: (ev) =>
		@finishTaskBttnYes.disabled = yes
		@finishTaskBttnNo.disabled = yes

		dataToSend = id_task: @taskId

		model = new Model ComponentUserTaskDetail.EventType.TASK_FINISH
		@listen ComponentUserTaskDetail.EventType.TASK_FINISH, model, @finishTaskOk
		hrtool.actions.finishUserTask model, dataToSend

		return

	finishTaskOk: ->
		@finishTaskBttnYes.disabled = no
		@finishTaskBttnNo.disabled = no
		@setButtonsDisplay no

		notification = document.createElement 'div'
		notification.innerHTML = 'Task has been completed.'
		@addNotification notification, ComponentNotificationCenter.DEFAULT_TIME, ComponentNotificationCenter.EventType.success

		@isFinished = yes

		taskParamsToSend =
			 taskId: @taskId
			 taskBuddy: @taskBuddy
			 taskTitle: @taskTitle
			 dateFrom: @dateFrom
			 dateTo: @dateTo
			 taskDescription: @taskDescription
			 taskNotes: @taskNotes
			 isFinished: @isFinished
		
		@element.className = @getTaskWrapperClass()
		@fire ComponentBase.EventType.CHANGE, taskParamsToSend

		return

	handleFinishTaskCanceled: (ev) =>
		@setButtonsDisplay no
		return

	setButtonsDisplay: (display) ->
		none = 'none'
		initial = 'initial'

		if @finishTaskBttn? and @finishTaskBttnYes? and @finishTaskBttnNo?
			if display
				@finishTaskBttn.style.display = none
				@finishTaskBttnYes.style.display = initial
				@finishTaskBttnNo.style.display = initial
			else
				@finishTaskBttn.style.display = initial
				@finishTaskBttnYes.style.display = none
				@finishTaskBttnNo.style.display = none

		return

	handleTextAreaEnable: (ev) =>
		@notesElement.readonly = no
		return

ComponentUserTaskDetail.EventType = 
	DATA_UPDATE: 'tasks/update'
	TASK_FINISH: 'tasks/finish'

module.exports = ComponentUserTaskDetail