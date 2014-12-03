ComponentBase = require '../componentBase'
ComponentFilterFormatter = require '../features/componentFilterFormatter'
ComponentFilter = require '../features/componentFilter'
ComponentTaskListFactory = require './componentTaskListFactory'
ComponentHide = require '../features/componentHide'
ComponentTaskList = require './componentTaskList'
ComponentUserTaskDetail = require './taskDetails/componentUserTaskDetail'
Model = require '../../models/model'
hrtool = require '../../models/actions'
helper = require '../../helpers/helpers'

class ComponentTaskListsInView extends ComponentBase
	constructor: (@title, listCompleted, listNotCompleted, @useFilter) ->
		super()
		@listCompleted = listCompleted
		@listNotCompleted = listNotCompleted
		@taskFilter = null
		@taskFilterData = null
		@isHr = helper.bulk.getData ["user","is_hr"]

		if @isHr
			@departments = @helper.bulk.getData ['departments']
			@teams = @helper.bulk.getData ['teams']
		else
			@departments = @helper.bulk.getData ['userDepartments']
			@teams = @helper.bulk.getData ['userTeams']

	createDom: ->
		outerHideWrapper = document.createElement 'div'
		outerHideWrapper.className = "outer-hide-wrapper"

		outerHideHeader = document.createElement 'h1'
		outerHideHeader.className = "lists-title"
		outerHideHeader.innerText = @title

		listsWrapper = document.createElement 'div'
		listsWrapper.className = "lists-wrapper"

		hideAll = new ComponentHide outerHideHeader, listsWrapper, no
		hideAll.render outerHideWrapper

		if @useFilter
			@taskFilterData = ComponentFilterFormatter.factory.createTeamDropdownsData @departments, @teams
			@taskFilter = new ComponentFilter @taskFilterData, ['department', 'team']
			@taskFilter.render listsWrapper
			@listen ComponentFilter.eventType.UPDATED, @taskFilter, @handleFilterUpdate

		notCompletedHeader = document.createElement 'h2'
		notCompletedHeader.className = "task-list-header"
		notCompletedHeader.innerText = "Tasks, which are still being worked on:"

		listNotCompletedWrapper = document.createElement 'div'
		listNotCompletedWrapper.className = "task-list-wrapper"

		hideNotCompleted = new ComponentHide notCompletedHeader, listNotCompletedWrapper, no
		hideNotCompleted.render listsWrapper

		completedHeader = document.createElement 'h2'
		completedHeader.className = "task-list-header"
		completedHeader.innerText = "Completed tasks:"

		listCompletedWrapper = document.createElement 'div'
		listCompletedWrapper.className = "task-list-wrapper"

		hideCompleted = new ComponentHide completedHeader, listCompletedWrapper, false
		hideCompleted.render listsWrapper

		@listNotCompleted.render listNotCompletedWrapper
		@listCompleted.render listCompletedWrapper
		@listen ComponentUserTaskDetail.eventType.TASK_FINISH, @listNotCompleted, @handleFinishTask
		@listen ComponentUserTaskDetail.eventType.TASK_UNFINISH, @listCompleted, @handleUnfinishTask
		@element = outerHideWrapper;

		return

	handleFinishTask: (src) ->
		@listCompleted.content.innerHTML = '' if Object.keys(@listCompleted.childs).length is 0

		finishedTask = new ComponentUserTaskDetail src, new Date()
		finishedTask.getElement().classList.add ComponentUserTaskDetail.classes.FINISHED_TASK
		@listCompleted.addChild 'task'+src.taskId, finishedTask, @listCompleted.content

		finishedTask.render @listCompleted.content if @listCompleted.rendered

		@listNotCompleted.childs["task"+src.taskId].component.destroy()
		@listNotCompleted.removeChild "task"+src.taskId

		@listNotCompleted.setNoTasks() if Object.keys(@listNotCompleted.childs).length is 0
		return


	handleUnfinishTask: (src) ->
		@listNotCompleted.content.innerHTML = '' if Object.keys(@listNotCompleted.childs).length is 0

		finishedTask = new ComponentUserTaskDetail src
		finishedTask.getElement().classList.remove ComponentUserTaskDetail.classes.FINISHED_TASK
		@listNotCompleted.addChild 'task'+src.taskId, finishedTask, @listNotCompleted.content

		finishedTask.render @listNotCompleted.content if @listNotCompleted.rendered

		@listCompleted.childs["task"+src.taskId].component.destroy()
		@listCompleted.removeChild "task"+src.taskId

		@listCompleted.setNoTasks() if Object.keys(@listCompleted.childs).length is 0
		return

	handleFilterUpdate: (dataFromFilter) ->
		selectedDepartment = dataFromFilter.department.id
		selectedTeam = dataFromFilter.team.id

		dataToSend =
			id_department: selectedDepartment
			id_team: selectedTeam
			is_hr: @isHr

		newModelNotCompleted = new Model ComponentTaskList.eventType.manager.DATA_LOAD_NOT_COMPLETED
		newModelCompleted = new Model ComponentTaskList.eventType.manager.DATA_LOAD_COMPLETED

		@listNotCompleted.setModel newModelNotCompleted, ComponentTaskList.eventType.manager.DATA_LOAD_NOT_COMPLETED
		@listCompleted.setModel newModelCompleted, ComponentTaskList.eventType.manager.DATA_LOAD_COMPLETED

		hrtool.actions.getManagerTaskDataNotCompleted @listNotCompleted.model, dataToSend
		hrtool.actions.getManagerTaskDataCompleted @listCompleted.model, dataToSend

		return

module.exports = ComponentTaskListsInView