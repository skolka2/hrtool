formatter = require './componentFilterFormatter'
ComponentSelect = require './componentSelect'
helper = require '../../helpers/helpers'
Model = require '../../models/model'

module.exports = ComponentSelectFactory =
	createDepartmentTeam: ->
		data = formatter.factory.createTeamDropdownsData helper.bulk.getDepartmentData(), helper.bulk.getTeamData()
		errorsInfo = ["Department is not selected.",  "Team is not selected."]
		select =  new ComponentSelect data, errorsInfo
		return select