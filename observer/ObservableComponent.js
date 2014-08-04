var ObservableComponent = function() {
    this.componentId = ObservableComponent.componentId++;
};

ObservableComponent.prototype.listen = function (type, fn, src) {
    Observer.getInstance().on(this, type, fn, src);
};

ObservableComponent.prototype.notify = function (type, data) {
    Observer.getInstance().fire(this, type, data);
};

ObservableComponent.prototype.setParentId = function (child) {
    ObservableComponent._componentMap[child.componentId] = this.componentId;
};

ObservableComponent.componentId = 1;
ObservableComponent._componentMap = {};
