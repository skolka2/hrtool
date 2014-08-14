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
        }
}