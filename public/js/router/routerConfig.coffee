ViewHome = require '../views/viewHome'
ViewDepartments = require '../views/viewDepartments'
ViewPeople = require '../views/viewPeople'
ViewTasks = require '../views/viewTasks'
ViewTest = require '../views/viewTest'
ViewDefault = require '../views/viewDefault'
ViewExport = require '../views/viewExport'
ViewImplicitTasks = require '../views/viewImplicitTasks'
ViewTemplates = require '../views/viewTemplates'

class RouterConfig

	setView: (data) ->
		switch data.view
			when 'home' then new ViewHome(data.parameters)
			when 'departments' then new ViewDepartments()
			when 'people' then new ViewPeople()
			when 'tasks' then new ViewTasks()
			when 'export' then new ViewExport()
			when 'implicit_tasks' then new ViewImplicitTasks()
			when 'templates' then new ViewTemplates()
			when 'test' then new ViewTest()
			else new ViewHome()

module.exports = RouterConfig