Model = require '../../models/model'
hrtool = require '../../models/actions'
ComponentStatusBar = require './componentStatusBar'

ComponentStatusBarFactory = 
	createStatusBar: (userId) ->
		statusBar = new ComponentStatusBar
		statusBarModel = new Model ComponentStatusBar.EventType.DATA_LOAD
		statusBar.setModel statusBarModel, ComponentStatusBar.EventType.DATA_LOAD
		hrtool.actions.getTasksCount statusBar.model, userId
		statusBar

module.exports = ComponentStatusBarFactory