var Model =  function(eventType) {
    EventEmitter.call(this);
    this.super = EventEmitter;
    this.eventType = eventType;
    this.data = null;
}

Model.prototype = new EventEmitter();
Model.prototype.constructor = Model;

Model.prototype.update = function(data){
    this.data = data;
    this.onUpdate();
}

Model.prototype.onUpdate = function(){
    this.fire(this.eventType, this.data);
}




