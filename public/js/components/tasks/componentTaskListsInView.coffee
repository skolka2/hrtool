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
		@listCompleted = listCompleted()
		@listNotCompleted = listNotCompleted()
		@taskFilter = null
		@taskFilterData = null
		@isHr = helper.bulk.getData ["user","is_hr"]

		if @isHr
			@departments = this.helper.bulk.getData ['departments']
			@teams = this.helper.bulk.getData ['teams']
		else
			@departments = this.helper.bulk.getData ['userDepartments']
			@teams = this.helper.bulk.getData ['userTeams']

	createDom: ->
		outerHideWrapper = document.createElement 'div'
		outerHideWrapper.className = "outer-hide-wrapper"

		outerHideHeader = document.createElement 'h1'
		outerHideHeader.className = "lists-title"
		outerHideHeader.innerText = @title

		listsWrapper = document.createElement 'div'
		listsWrapper.className = "lists-wrapper"

		hideAll = new ComponentHide outerHideHeader, listsWrapper, false
		hideAll.render outerHideWrapper

		if @useFilter
			@taskFilterData = ComponentFilterFormatter.factory.createTeamDropdownsData @departments, @teams
			@taskFilter = new ComponentFilter @taskFilterData, ['department', 'team']
			@taskFilter.render listsWrapper
			@listen ComponentFilter.EventType.UPDATED, @taskFilter, @handleFilterUpdate

		notCompletedHeader = document.createElement 'h2'
		notCompletedHeader.className = "task-list-header"
		notCompletedHeader.innerText = "Tasks, which are still being worked on:"

		listNotCompletedWrapper = document.createElement 'div'
		listNotCompletedWrapper.className = "task-list-wrapper"

		hideNotCompleted = new ComponentHide notCompletedHeader, listNotCompletedWrapper, false
		hideNotCompleted.render listsWrapper

		completedHeader = document.createElement 'h2'
		completedHeader.className = "task-list-header"
		completedHeader.innerText = "Completed tasks:"

		listCompletedWrapper = document.createElement 'div'
		listCompletedWrapper.className = "task-list-wrapper"

		hideCompleted = new ComponentHide completedHeader, listCompletedWrapper, true
		hideCompleted.render listsWrapper

		@listNotCompleted.render listNotCompletedWrapper
		@listCompleted.render listCompletedWrapper
		@listen ComponentBase.EventType.CHANGE, this.listNotCompleted, this.handleFinishTask
		@element = outerHideWrapper;

		return

	handleFinishTask: (src) ->
		@listCompleted.content.innerHTML = '' if Object.keys(@listCompleted.childs).length is 0

		finishedTask = new ComponentUserTaskDetail src
		@listCompleted.addChild 'task'+src.taskId, finishedTask, @listCompleted.content

		finishedTask.render @listCompleted.content if @listCompleted.rendered

		@listNotCompleted.childs["task"+src.taskId].component.destroy()
		@listNotCompleted.removeChild "task"+src.taskId

		@listNotCompleted.setNoTasks() if Object.keys(this.listNotCompleted.childs).length is 0

		return

	handleFilterUpdate: (dataFromFilter) ->
		selectedDepartment = dataFromFilter.department.id
		selectedTeam = dataFromFilter.team.id

		dataToSend =
			id_department: selectedDepartment
			id_team: selectedTeam
			is_hr: this.isHr

		newModelNotCompleted = new Model ComponentTaskList.EventType.manager.DATA_LOAD_NOT_COMPLETED
		newModelCompleted = new Model ComponentTaskList.EventType.manager.DATA_LOAD_COMPLETED

		@listNotCompleted.setModel newModelNotCompleted, ComponentTaskList.EventType.manager.DATA_LOAD_NOT_COMPLETED
		@listCompleted.setModel newModelCompleted, ComponentTaskList.EventType.manager.DATA_LOAD_COMPLETED

		hrtool.actions.getManagerTaskDataNotCompleted @listNotCompleted.model, dataToSend
		hrtool.actions.getManagerTaskDataCompleted @listCompleted.model, dataToSend

		return

module.exports = ComponentTaskListsInView