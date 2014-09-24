var Model = require('../../models/model');
var hrtool = require('../../models/actions');
var ComponentTable = require('./componentTable');
var helper = require('../../helpers/helpers');

var ComponentTableFactory = module.exports = {
	implicitTable: function() {
		var implicitTab = new ComponentTable(ComponentTableFactory.getImplicitTableFormat, ComponentTableFactory.implicitTableSettings  );
		implicitTab.setModel(new Model(ComponentTableFactory.implicitTableSettings.endpoint),ComponentTableFactory.implicitTableSettings.endpoint);
		implicitTab._action(implicitTab.model, implicitTab.reqData);
		return implicitTab;
	},
	implicitTableSettings : {
		limit: 1,
		offset:0,
		sortBy: 'id_task_implicit',   //order by 'column_name' for first onLoad
		sort_way: "DESC",
		endpoint : 'tasks/implicit/list',
		actionFunc : hrtool.actions.getImplicitTasks

	},
	getImplicitTableFormat: function(){
		return [{	title:'jmeno',
			keys:['title'],
			sortKey: 'title',
			formatter:function(params){
				return '<span>'+params[0]+'</span>';
			}
		},{
			title:'department',
			keys:['id_department'],
			formatter:function(params){
				if(params[0] !== null){
					return '<span >'+ helper.bulk.getDepartmentData()[params[0]].title+'</span>';
				}
				return '<span> - </span>';

				
			}
		},{
			title:'team',
			keys:['id_team'],
			formatter:function(params){
				if(params[0] !== null){
					return '<span >'+helper.bulk.getTeamData()[params[0]].title+'</span>';
				}
				return '<span> - </span>';
			}
		},{
			title:'start',
			keys:['start_day'],
			sortKey: 'start_day',
			formatter:function(params){
				return '<span >'+params[0]+'</span>';
			}
		},{
			title:'duration',
			keys:['duration'],
			sortKey: 'duration',
			formatter:function(params){
				return '<span >'+params[0]+'</span>';
			}
		},{
			title:'desc',
			keys:['description'],
			sortKey: 'description',
			formatter:function(params){
				return '<span >'+params[0]+'</span>';
			}

		}
		]
	},



}