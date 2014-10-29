ViewHome = require '../views/viewHome'
ViewDepartmentAdmin = require '../views/viewDepartmentAdmin'
ViewPeopleAdmin = require '../views/viewPeopleAdmin'
ViewTaskAdmin = require '../views/viewTaskAdmin'
ViewTest = require '../views/viewTest'
ViewDefault = require '../views/viewDefault'
ViewExport = require '../views/viewExport'
ViewImplicitTasks = require '../views/viewImplicitTasks'
ViewTemplateTasks = require '../views/ViewTemplateTasks'

class RouterConfig

	setView: (data) ->
		switch data.view
			when 'home' then new ViewHome()
			when 'templates' then new ViewDepartmentAdmin()
			when 'people' then new ViewPeopleAdmin()
			when 'tasks' then new ViewTaskAdmin()
			when 'export' then new ViewExport()
			when 'implicit' then new ViewImplicitTasks()
			when 'template' then new ViewTemplateTasks()
			when 'test' then new ViewTest()
			else new ViewHome()

module.exports = RouterConfig