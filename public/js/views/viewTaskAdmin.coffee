ViewBase =  require './viewBase'
ComponentAddTask = require '../components/features/addTask/newTask/componentAddTask'
ComponentHide = require '../components/features/componentHide'
helper = require '../helpers/helpers'
ComponentTemplateListFactory = require '../components/templateList/componentTemplateListFactory'
ComponentTaskImplicit = require '../components/features/addTask/componentTaskImplicit'


class ViewTaskAdmin extends ViewBase
	constructor: () ->
		super()


	render: () ->

		super arguments
		mainWrapper = document.getElementById ViewBase.mainWrapper
		viewWrapper = document.createElement('div')
		viewWrapper.className = "view-wraper"
		viewWrapper.innerHTML = "Task Admin View"
		viewWrapper.appendChild document.createElement('br')

		div = document.createElement 'div'
		component = new ComponentAddTask()
		component.render div
		hide = new ComponentHide helper.dom.createElement("<span>Insert new task</span>"), div, no
		hide.render viewWrapper

		@componentTemplateList = new ComponentTemplateListFactory.createAll()
		dataForImplicit =
			id_task_template: 5
			id_department: 2
			id_team: 3
			title: "title example"
		@componentTaskImplicit = new ComponentTaskImplicit dataForImplicit
		implicitWrapper = document.createElement 'div'
		hideImplicit = new ComponentHide helper.dom.createElement("<span>Insert new implicit task(still example data)</span>"), implicitWrapper, no
		viewWrapper.appendChild implicitWrapper
		templateWrapper = document.createElement 'div'
		hideTemplate = new ComponentHide helper.dom.createElement("<span>Show template tasks</span>"), templateWrapper, no
		@componentTaskImplicit.render implicitWrapper
		@componentTemplateList.render templateWrapper
		hideImplicit.render viewWrapper
		hideTemplate.render viewWrapper
		mainWrapper.appendChild viewWrapper
		return


module.exports = ViewTaskAdmin