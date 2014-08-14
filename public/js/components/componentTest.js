var ComponentTest = function () {
    this.super = ComponentBase;
    this.super.call(this);
    this.model = new Model(ComponentTest.EventType.DATA_LOAD);
    //listen on data loda
    this.listen(ComponentTest.EventType.DATA_LOAD, this.model, this.onLoad);
    //load data
    hrtool.actions.getTestData(this.model);
}
ComponentTest.prototype = new ComponentBase();
ComponentTest.prototype.constructor = ComponentTest;

ComponentTest.prototype.createDom = function(){
    var el = document.createElement('div');
    el.className = 'test-element-wrapper';
    this.element = el;
}

ComponentTest.prototype.onLoad = function(data){
    wrapper = this.getElement();
    var span;
    for(var name in data) {
        span = document.createElement('span');
        span.innerHTML = '<strong>' + name + '</strong> has car: ' + data[name].car + '<br>';
        wrapper.appendChild(span);
    }
}

ComponentTest.EventType = {
    DATA_LOAD: 'test-data-load'
}