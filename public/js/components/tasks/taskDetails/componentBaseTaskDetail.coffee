ComponentBase = require '../../componentBase'
ComponentDeadlineInfo = require "../componentDeadlineInfo"

class ComponentBaseTaskDetail extends ComponentBase
	constructor: (taskParams, tempFinishDate) ->
		super()
		@taskId = taskParams.taskId
		@taskBuddy = taskParams.taskOwner
		@taskTitle = taskParams.taskTitle
		@dateTo = new Date taskParams.dateTo
		@dateFinished = new Date taskParams.dateFinished
		@taskDescription = if tempFinishDate? then tempFinishDate else taskParams.taskDescription
		@taskNotes = taskParams.taskNotes
		@isFinished = taskParams.isFinished
		@notesTextArea = null;
		console.log @dateFinished
		return

	createDom: ->
		jadeData =
			taskWrapperClass: ComponentBaseTaskDetail.classes.TASK_WRAPPER_CLASS
			headerWrapperClass: ComponentBaseTaskDetail.classes.HEADER_WRAPPER_CLASS
			buddyLabelClass: ComponentBaseTaskDetail.classes.BUDDY_LABEL_CLASS
			notesWrapperClass: ComponentBaseTaskDetail.classes.NOTES_WRAPPER_CLASS
			footerWrapperClass: ComponentBaseTaskDetail.classes.FOOTER_WRAPPER_CLASS
			footerWrapperClass2: ComponentBaseTaskDetail.classes.FOOTER_WRAPPER_CLASS_2
			buddy: @taskBuddy
			title: @taskTitle
			deadlineInfoWrapper: ComponentBaseTaskDetail.classes.DEADLINE_INFO_WRAPPER_CLASS
			description: @taskDescription
		@element = @helper.tpl.create 'components/tasks/taskDetails/componentBaseTaskDetail', jadeData
		notesWrapper = (@element.getElementsByClassName ComponentBaseTaskDetail.classes.NOTES_WRAPPER_CLASS)[0]

		@footerWrapper = @element.getElementsByClassName(ComponentBaseTaskDetail.classes.FOOTER_WRAPPER_CLASS)[0]
		@footerWrapper.innerHTML = ''
		@footerWrapper.style.height = '0'

		@setNotes()
		notesWrapper.appendChild @notesTextArea
		deadlineInfoWrapper = @element.getElementsByClassName(ComponentBaseTaskDetail.classes.DEADLINE_INFO_WRAPPER_CLASS)[0]
		deadlineInfo = new ComponentDeadlineInfo @dateTo, @dateFinished, @isFinished
		deadlineInfo.render deadlineInfoWrapper
		return

	setNotes: () =>
		@notesTextArea = document.createElement 'textarea'
		@notesTextArea.innerHTML = @taskNotes
		if @isFinished is yes
			@notesTextArea.readOnly = true
		else
			@notesTextArea.addEventListener ComponentBase.eventType.FOCUS, @handleAddNoteClick, no
		@notesTextArea.addEventListener ComponentBase.eventType.BLUR, @handleTextareaBlur, no
		@notesTextArea.disabled = yes
		@notesTextArea.rows = Math.round @taskNotes?.length/40 + 1
		if @taskNotes is null or @taskNotes.length <= 0 then @notesTextArea.style.display = "none"
		return

ComponentBaseTaskDetail.classes =
	FINISHED_TASK: "finished"
	TASK_WRAPPER_CLASS: "task-wrapper"
	HEADER_WRAPPER_CLASS: "header-wrapper"
	BUDDY_LABEL_CLASS: "buddy-label"
	NOTES_WRAPPER_CLASS: "notes-wrapper"
	DEADLINE_INFO_WRAPPER_CLASS: "task-deadline-info"
	FOOTER_WRAPPER_CLASS: "footer-wrapper"
	FOOTER_WRAPPER_CLASS_2: "footer-wrapper-2"

module.exports = ComponentBaseTaskDetail