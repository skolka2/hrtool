ComponentBase = require '../componentBase'

class ComponentStatusBar extends ComponentBase
	constructor: ->
		super()
		@data = null
		return

	onLoad: (data) ->
		@data =
			userFirstName: @helper.bulk.getData ['user', 'first_name']
			userLastName: @helper.bulk.getData ['user', 'last_name']
			allTasks: data[0].all_tasks
			finishedTasks: data[0].finished_tasks
			deadlineTasks: data[0].deadline_tasks

		infoSpan = (@element.getElementsByClassName ComponentStatusBar.classes.INFO_SPAN_CLASS)[0]
		infoSpan.innerText = "Welcome, #{ @data.userFirstName } #{ @data.userLastName }, here are your awesome tasks. You have #{ @data.finishedTasks }/#{ @data.allTasks } finished, #{ @data.deadlineTasks } after deadline..."

		finishedDiv = (@element.getElementsByClassName ComponentStatusBar.classes.PROGRESS_DIV_FINISHED)[0]
		finishedDiv.style.width = @getFinishedPartWidth()

		deadlineDiv = (@element.getElementsByClassName ComponentStatusBar.classes.PROGRESS_DIV_DEADLINE)[0]
		deadlineDiv.style.width = @getDeadlinePartWidth()

		return

	createDom: ->

		jadeData =
			infoSpanClass: ComponentStatusBar.classes.INFO_SPAN_CLASS
			progressDivFinished: ComponentStatusBar.classes.PROGRESS_DIV_FINISHED
			progressDivDeadline: ComponentStatusBar.classes.PROGRESS_DIV_DEADLINE

		@element = this.helper.tpl.create 'components/features/componentStatusBar', jadeData

		return

	getFinishedPartWidth: -> percent = ((100 * (@data.finishedTasks / @data.allTasks)) + '%')

	getDeadlinePartWidth: -> percent = ((100 * (@data.deadlineTasks / @data.allTasks)) + '%')

ComponentStatusBar.eventType.DATA_LOAD = 'tasks/count'

ComponentStatusBar.classes =
	INFO_SPAN_CLASS: "status-bar-info-text"
	PROGRESS_DIV_FINISHED: "status-bar-progress-finished"
	PROGRESS_DIV_DEADLINE: "status-bar-progress-deadline"

module.exports = ComponentStatusBar