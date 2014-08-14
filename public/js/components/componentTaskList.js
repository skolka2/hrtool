var ComponentTaskList = function () {
    this.super = ComponentBase;
    this.super.call(this);
    this.model = new Model(ComponentTaskList.EventType.DATA_LOAD);
    //listen on data loda
    this.listen(ComponentTaskList.EventType.DATA_LOAD, this.model, this.onLoad);
    //load data
    hrtool.actions.getTaskData(this.model);
}
ComponentTaskList.prototype = new ComponentBase();
ComponentTaskList.prototype.constructor = ComponentTaskList;

ComponentTaskList.prototype.createDom = function () {
    var div = document.createElement("div");
    div.className = "TaskList";
    for (var i = 0; i < this.model.data.length; i++) {
        //var task = new ComponentTaskDetail(this.model.data[i].task_title, this.model.data[i].date_from, this.model.data[i].date_to, this.model.data[i].task_description, this.model.data[i].task_notes, this.model.data[i].task_buddy, this.model.data[i].task_finished);
        var task = new ComponentTaskDetail(this.model.data[i]);
        this.addChild("task" + i, task, this.wrapper);
    }
    this.element = div;
}

ComponentTaskList.EventType = {
    DATA_LOAD: 'getAllTasks'
}

ComponentTaskList.prototype.onLoad = function (data) {
    this.data = data;
    wrapper = this.getElement();

}
