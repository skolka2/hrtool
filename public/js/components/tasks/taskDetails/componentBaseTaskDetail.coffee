ComponentBase = require '../../componentBase'

class ComponentBaseTaskDetail extends ComponentBase
	constructor: (taskParams) ->
		super()
		@taskId = taskParams.taskId
		@taskBuddy = taskParams.taskOwner
		@taskTitle = taskParams.taskTitle
		@dateFrom = new Date taskParams.dateFrom
		@dateTo = new Date taskParams.dateTo
		@taskDescription = taskParams.taskDescription
		@taskNotes = taskParams.taskNotes
		@isFinished = taskParams.isFinished
		@notesElement = null;
		return

	createDom: ->
		taskDateString = "Timerange: #{@helper.format.getDate this.dateFrom} - #{@helper.format.getDate this.dateTo}"

		jadeData =
			taskWrapperClass: @getTaskWrapperClass()
			headerWrapperClass: ComponentBaseTaskDetail.taskClasses.HEADER_WRAPPER_CLASS
			buddyLabelClass: ComponentBaseTaskDetail.taskClasses.BUDDY_LABEL_CLASS
			notesWrapperClass: ComponentBaseTaskDetail.taskClasses.NOTES_WRAPPER_CLASS
			footerWrapperClass: ComponentBaseTaskDetail.taskClasses.FOOTER_WRAPPER_CLASS

			buddy: @taskBuddy
			title: @taskTitle
			taskDate: taskDateString
			description: @taskDescription

		@element = @helper.tpl.create 'components/tasks/taskDetails/componentBaseTaskDetail', jadeData
		notesWrapper = (@element.getElementsByClassName ComponentBaseTaskDetail.taskClasses.NOTES_WRAPPER_CLASS)[0]
		@setNotes()
		notesWrapper.appendChild @notesElement

		return

	setNotes: ->
		@notesElement = document.createElement 'p'
		@notesElement.className = "notes-text"
		@notesElement.innerHTML = @taskNotes

	getTaskWrapperClass: ->
		wrapperClass = ["task-wrapper"]
		wrapperClass.push "overflow" unless @isFinished or @dateTo >= new Date()
		wrapperClass

ComponentBaseTaskDetail.taskClasses =
	HEADER_WRAPPER_CLASS: "header-wrapper"
	BUDDY_LABEL_CLASS: "buddy-label"
	NOTES_WRAPPER_CLASS: "notes-wrapper"
	FOOTER_WRAPPER_CLASS: "footer-wrapper"

module.exports = ComponentBaseTaskDetail