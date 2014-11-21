ComponentBase = require '../../componentBase'
ComponentBaseTaskDetail = require './componentBaseTaskDetail'
NotificationCenter = require '../../componentNotificationCenter'
Model = require '../../../models/model'
hrtool = require '../../../models/actions'

class ComponentUserTaskDetail extends ComponentBaseTaskDetail
	constructor: (taskParams) ->
		super taskParams
		@taskBuddy = taskParams.taskBuddy
		@addNoteButtonVisible = no
		return

	createDom: ->
		super

		@footerWrapper.style.height = '50px'
		@notesTextArea.disabled = no

		@addNotesDiv = document.createElement "div"
		@addNotesDiv.className = "add-note-div"
		@addNoteButton = document.createElement "p"
		@addNoteButton.className = "add-note-button"
		@addNoteButton.innerHTML = if @taskNotes.length >= 0 then "Edit Note" else "Add Note"
		@addNoteButton.addEventListener ComponentBase.eventType.CLICK, @handleAddNoteClick, no

		@cancelButton = document.createElement "p"
		@cancelButton.className = "cancel-button hidden-buttons"
		@cancelButton.innerHTML = "Cancel"
		@cancelButton.addEventListener ComponentBase.eventType.CLICK, @handleCancelClick, no

		@saveButton = document.createElement "p"
		@saveButton.className = "save-notes-button hidden-buttons"
		@saveButton.innerHTML = "Save"
		@saveButton.addEventListener ComponentBase.eventType.CLICK, @handleSaveNotesClick, no

		@addNotesDiv.appendChild @addNoteButton
		@addNotesDiv.appendChild @cancelButton
		@addNotesDiv.appendChild @saveButton

		@footerWrapper.appendChild @addNotesDiv

		@finishTaskButton = document.createElement "p"
		@finishTaskButton.className = "finish-task-button"
		@finishTaskButton.innerHTML = "Finish Task"
		@finishTaskButton.addEventListener ComponentBase.eventType.CLICK, @handleFinishTaskClick, no
		@footerWrapper.appendChild @finishTaskButton


		footerWrapper3 = @element.getElementsByClassName(ComponentBaseTaskDetail.classes.FOOTER_WRAPPER_CLASS_2)[0]

		@unfinishTaskButton = document.createElement "p"
		@unfinishTaskButton.className = "unfinish-task-button"
		@unfinishTaskButton.innerHTML = "Unfinish Task"
		@unfinishTaskButton.addEventListener ComponentBase.eventType.CLICK, @handleUnfinishClick, no
		footerWrapper3.appendChild @unfinishTaskButton

		return



	handleAddNoteClick: (ev) =>
		@notesTextArea.style.display = "block"
		@notesTextArea.focus()
		@notesTextArea.readonly = no
		@addNoteButtonVisible = no
		@changeFooterDiv()
		return



	handleTextareaBlur: (ev) =>
		@addNoteButtonVisible = yes
		@changeFooterDiv()
		return



	handleSaveNotesClick: (ev) =>
		if @notesTextArea.value is @taskNotes
			@addNotification "Nothing has been changed.", NotificationCenter.DEFAULT_TIME, NotificationCenter.eventType.NEUTRAL
		else
			@taskNotes = @notesTextArea.value
			dataToSend =
				id_task: @taskId
				notes: @taskNotes

			model = new Model ComponentUserTaskDetail.eventType.DATA_UPDATE
			@listen ComponentUserTaskDetail.eventType.DATA_UPDATE, model, @onNotesSave
			hrtool.actions.updateUserTaskData model, dataToSend
		return



	handleCancelClick: (src) =>
		@notesTextArea.value = @taskNotes;
		return




	onNotesSave: (data) =>
		if data.name? is 'error'
			@addNotification "Something messed up during saving!\n error code: #{data.code?}",
				NotificationCenter.DEFAULT_TIME, NotificationCenter.eventType.ERROR
		else
			@addNotification 'Saving was successful!', NotificationCenter.DEFAULT_TIME,
				NotificationCenter.eventType.SUCCESS
		return



	handleFinishTaskClick: (ev) =>
		dataToSend =
			id_task: @taskId

		model = new Model ComponentUserTaskDetail.eventType.TASK_FINISH
		@listen ComponentUserTaskDetail.eventType.TASK_FINISH, model, @onFinishTask
		hrtool.actions.finishUserTask model, dataToSend
		return


	handleUnfinishClick: (ev) =>
		dataToSend =
			id_task: @taskId
			completed: no
		model = new Model ComponentUserTaskDetail.eventType.TASK_UNFINISH
		@listen ComponentUserTaskDetail.eventType.TASK_UNFINISH, model, @onUnfinishTask
		hrtool.actions.unfinishUserTask model, dataToSend
		return



	onFinishTask: (data) =>
		if data.name? is 'error'
			@addNotification "Something messed up during saving!\n error code: #{data.code?}",
				NotificationCenter.DEFAULT_TIME, NotificationCenter.eventType.ERROR
		else
			@addNotification 'Task has been finished.', NotificationCenter.DEFAULT_TIME,
				NotificationCenter.eventType.SUCCESS

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

		@fire ComponentUserTaskDetail.eventType.TASK_FINISH, taskParamsToSend
		return


	onUnfinishTask: (data) =>
		if data.name? is 'error'
			@addNotification "Something messed up during saving!\n error code: #{data.code?}",
				NotificationCenter.DEFAULT_TIME, NotificationCenter.eventType.ERROR
		else
			@addNotification 'Task has been unfinished.', NotificationCenter.DEFAULT_TIME,
				NotificationCenter.eventType.SUCCESS

		@isFinished = no
		taskParamsToSend =
			taskId: @taskId
			taskBuddy: @taskBuddy
			taskTitle: @taskTitle
			dateFrom: @dateFrom
			dateTo: @dateTo
			taskDescription: @taskDescription
			taskNotes: @taskNotes
			isFinished: @isFinished

		@fire ComponentUserTaskDetail.eventType.TASK_UNFINISH, taskParamsToSend
		return;



	changeFooterDiv: () ->
		if @addNoteButtonVisible is yes
			@addNoteButtonVisible = no
			@saveButton.classList.remove 'visible-buttons'
			@cancelButton.classList.remove 'visible-buttons'
			@saveButton.classList.add 'hidden-buttons'
			@cancelButton.classList.add 'hidden-buttons'
		else
			@addNoteButtonVisible = yes
			@saveButton.classList.remove 'hidden-buttons'
			@cancelButton.classList.remove 'hidden-buttons'
			@saveButton.classList.add 'visible-buttons'
			@cancelButton.classList.add 'visible-buttons'
		return

ComponentUserTaskDetail.eventType =
	DATA_UPDATE: 'tasks/update'
	TASK_FINISH: 'tasks/finish'
	TASK_UNFINISH: 'tasks/update'


module.exports = ComponentUserTaskDetail