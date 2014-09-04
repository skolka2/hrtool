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

     getUserTaskData: function(model) {
     	var mediator = new Mediator();
     	mediator.loadData('tasks/user/list', {}, model);
     },

     updateUserTaskData: function(model, data) {
     	var mediator = new Mediator();
     	mediator.loadData('tasks/update', data, model);
     },

     finishUserTask: function(model, data) {
     	var mediator = new Mediator();
     	mediator.loadData('tasks/finish', data, model);
     }
}