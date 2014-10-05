var Model = require('../../models/model');
var hrtool = require('../../models/actions');
var ComponentTable = require('./componentTable');
var helper = require('../../helpers/helpers');
var ComponentCheckBox = require('../features/componentCheckBox');
var helper = require('../../helpers/helpers');
var ComponentEditUser = require('../componentEditUser');
var ComponentPopupFactory = require('../componentPopupFactory');

var ComponentTableFactory = module.exports = {
    implicitTable: function() {
        var implicitTab = new ComponentTable(ComponentTableFactory.getImplicitTableFormat, ComponentTableFactory.implicitTableSettings  );
        implicitTab.setModel(new Model(ComponentTableFactory.implicitTableSettings.endpoint),ComponentTableFactory.implicitTableSettings.endpoint);
        implicitTab._action(implicitTab.model, implicitTab.reqData);
        return implicitTab;
    },
    createUsersTable: function() {
        var usersTable = new ComponentTable(ComponentTableFactory.getUsersTableFormat, ComponentTableFactory.usersTableSettings);
        usersTable.setModel(new Model(ComponentTableFactory.usersTableSettings.endpoint), ComponentTableFactory.usersTableSettings.endpoint);
        hrtool.actions.getUsersForTable(usersTable.model, usersTable.reqData);
        return usersTable;
    },
    implicitTableSettings : {
        limit: 3,
        offset:0,
        sortBy: 'id_task_implicit',   //order by 'column_name' for first onLoad
        sort_way: "DESC",
        endpoint : 'tasks/implicit/list',
        actionFunc : hrtool.actions.getImplicitTasks

    },
    usersTableSettings: {
        limit: 4,
        offset:0,
        sortBy: 'full_name',   //order by 'column_name' for first onLoad
        sortDesc: false,
        sort_way: "ASC",
        endpoint : 'user/get-table-data',
        actionFunc : hrtool.actions.getUsersForTable
    },
    getImplicitTableFormat: function(){
        return [{	title:'Title',
            keys:['title'],
            sortKey: 'title',
            formatter:function(params){
                return '<span>'+params[0]+'</span>';
            }
        },{
            title:'Department',
            keys:['id_department'],
            formatter:function(params){
                if(params[0] == null)
                    return '<span > -</span>';
                else
                    return '<span >'+ helper.bulk.getDepartmentData()[params[0]].title+'</span>';
            }
        },{
            title:'Team',
            keys:['id_team'],
            formatter:function(params){
                if(params[0] == null)
                    return '<span > -</span>';
                else
                    return '<span >'+ helper.bulk.getTeamData()[params[0]].title+'</span>';
            }
        },
            {
                title:'Tasks starts at',
                keys:['start_day'],
                sortKey: 'start_day',
                formatter:function(params){
                    return '<span >'+params[0]+'</span>';
                }
            },{
                title:'Task lenght',
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
            },
            {
                title: 'Functions',
                keys: ['id_user'],
                formatter: function (params) {
                    var div, button, popup;
                    div = document.createElement('div');
                    div.className = 'functions-div';

                    button = document.createElement('button');
                    button.innerHTML = 'Save';
                    div.appendChild(button);

                    button = document.createElement('button');
                    button.innerHTML = 'Edit';
                    div.appendChild(button);


                    button = document.createElement('button');
                    button.innerHTML = 'Remove';
                    div.appendChild(button);
                  return div;
                }
            }
        ]
    },
    getUsersTableFormat: function(){
        return [
            {
                title:'Name',
                keys:['full_name'],
                sortKey: 'full_name',
                formatter:function(params){
                    var div = document.createElement('div');
                    div.className = 'name-div';
                    div.innerHTML = '<span>'+params[0]+'</span>';
                    return div;
                }
            },
            {
                title: 'Done',
                keys: ['done', 'undone'],
                formatter: function(params){
                    var div = document.createElement('div');
                    div.className = 'tasks';
                    var span = document.createElement('span');
                    span.className = 'done-tasks-count';
                    span.innerHTML = params[0];
                    div.appendChild(span);
                    div.appendChild(document.createTextNode('/'));
                    span = document.createElement('span');
                    span.className = 'undone-tasks-count';
                    span.innerHTML = params[1];
                    div.appendChild(span);
                    return div;
                }
            },
            {
                title:'Department/Team',
                keys:['id_user'],
                formatter:function(params){
                    return new ComponentEditUser(params[0]).getElement();
                }
            },
            {
                title: 'Functions',
                keys: ['id_user'],
                formatter: function(params){
                    var div, button, popup;
                    div = document.createElement('div');
                    div.className = 'functions-div';

                    button = document.createElement('button');
                    button.innerHTML = 'View Tasks';
                    div.appendChild(button);

                    button = document.createElement('button');
                    button.innerHTML = 'Add New Task';
                    div.appendChild(button);
                    popup = ComponentPopupFactory.getNewTaskPopup(button);
                    popup.render(document.getElementById('popup-wrapper'));

                    button = document.createElement('button');
                    button.innerHTML = 'Edit';
                    div.appendChild(button);
                    popup = ComponentPopupFactory.getUserEditPopup(button, params[0]);
                    popup.render(document.getElementById('popup-wrapper'));

                    button = document.createElement('button');
                    button.innerHTML = 'Remove';
                    div.appendChild(button);

                    return div;
                }
            }
        ];
    }



};