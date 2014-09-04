var hrtool = hrtool || {}

hrtool.actions = {
    getTestData: function(model){
        var mediator = new Mediator();
//        mediator.loadData('test-data',{},model);
        mediator.fakeLoadData('test-data',{},model);
    },
    getTaskData: function (model) {
            var mediator = new Mediator();
            //        mediator.loadData('test-data',{},model);
            mediator.loadData('task:getAll', {}, model);
    },
    getDefaultTaskData: function (model) {
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
    }
}