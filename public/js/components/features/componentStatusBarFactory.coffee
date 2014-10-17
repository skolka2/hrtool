Model = require '../../models/model'
hrtool = require '../../models/actions'
ComponentStatusBar = require './componentStatusBar'

ComponentStatusBarFactory = 
	createStatusBar: ->
		statusBar = new ComponentStatusBar
		statusBarModel = new Model ComponentStatusBar.EventType.DATA_LOAD
		statusBar.setModel statusBarModel, ComponentStatusBar.EventType.DATA_LOAD
		hrtool.actions.getTasksCount statusBar.model
		statusBar

module.exports = ComponentStatusBarFactory