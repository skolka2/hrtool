var Mediator = require('./mediator');

var hrtool = module.exports = hrtool || {}

hrtool.actions = {
    getTestData: function(model){
        var mediator = new Mediator();
//        mediator.loadData('test-data',{},model);
        mediator.fakeLoadData('test-data',{},model);
    },
    getTaskData: function (model) {
            var mediator = new Mediator();
            //        mediator.loadData('test-data',{},model);
            mediator.loadData('tasks/get-all', {}, model);
    },
    getTemplatesData : function(model){
        var mediator = new Mediator();
        mediator.loadData('template/get-all', {}, model);
    },
    saveDefaultTaskData: function (model,data) {
        var mediator = new Mediator();
        mediator.loadData('template/update', data, model);
    },
    deleteDefaultTaskData: function (model,data) {
        var mediator = new Mediator();
        mediator.loadData('template/delete', data, model);
     },

    getBuddyTaskData: function (model) {
    	var mediator = new Mediator();
    	mediator.loadData('tasks/buddy/list', {}, model);
    },

    getBuddyTaskDataCompleted: function (model) {
    	var mediator = new Mediator();
    	mediator.loadData('tasks/buddy/list/completed', {}, model);
    },

    getBuddyTaskDataNotCompleted: function (model) {
    	var mediator = new Mediator();
    	mediator.loadData('tasks/buddy/list/not-completed', {}, model);
    },
    saveImplicitTaskData: function (model,data) {
        var mediator = new Mediator();
        mediator.loadData('tasks/implicit/insert', data, model);
    },
     getUserTaskData: function(model) {
     	var mediator = new Mediator();
     	mediator.loadData('tasks/user/list', {}, model);
     },
    getUserTaskDataCompleted: function(model) {
        var mediator = new Mediator();
        mediator.loadData('tasks/user/list/completed', {}, model);
    },
    getUserTaskDataNotCompleted: function(model) {
        var mediator = new Mediator();
        mediator.loadData('tasks/user/list/not-completed', {}, model);
    },

     updateUserTaskData: function(model, data) {
     	var mediator = new Mediator();
     	mediator.loadData('tasks/update', data, model);
     },

     finishUserTask: function(model, data) {
     	var mediator = new Mediator();
     	mediator.loadData('tasks/finish', data, model);
     },
    getUsers : function(model, data){
        var mediator = new Mediator();
        mediator.loadData('user/get-all', data, model);
    },

    getUsersForTable : function(model, data){
        var mediator = new Mediator();
        mediator.loadData('user/get-table-data', data, model);
    },

    insertNewTask : function(model, data){
        var mediator = new Mediator();
        mediator.loadData('tasks/insert', data, model);
    },

    insertNewTemplate : function(model, data){
        var mediator = new Mediator();
        mediator.loadData('template/insert', data, model);
    },
    saveFormAddUser: function (model, data) {
        var mediator = new Mediator();
        mediator.loadData('user/insert', data, model);
    },
    getHR: function(model, data) {
        var mediator = new Mediator();
        mediator.loadData('user/get/HR', data, model);
    },
    getImplicitTasks : function(model, data){
        var mediator = new Mediator();
        mediator.loadData('tasks/implicit/list', data, model);
    },

    getUserTeams: function(model, data) {
        var mediator = new Mediator();
        mediator.loadData('user/get-teams', data, model);
    },

    getBasicUserInfo: function(model, data){
        var mediator = new Mediator();
        mediator.loadData('user/get-basic-info', data, model);
    },

    getManagerTaskData: function(model) {
    	var mediator = new Mediator();
    	mediator.loadData('tasks/teams/list', {}, model);
    },

    getManagerTaskDataCompleted: function(model, data) {
        var mediator = new Mediator();
        mediator.loadData('tasks/teams/list/completed', data, model);
    },

    getManagerTaskDataNotCompleted: function(model, data) {
        var mediator = new Mediator();
        mediator.loadData('tasks/teams/list/not-completed', data, model);
    },

    getTasksCount: function(model) {
        var mediator = new Mediator();
        mediator.loadData('tasks/count', {}, model);
    }
};