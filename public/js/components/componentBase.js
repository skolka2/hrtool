var EventEmitter =require('../observer/ObservableComponent');
var helper = require('../helpers/helpers');


//Default constructor
var ComponentBase = module.exports = function(){
	EventEmitter.apply(this);
	this.super = EventEmitter;
	this.childs = {};
	this.element = null;
	this.rendered = false;

	this.helper = helper;
}

ComponentBase.prototype = new EventEmitter();
ComponentBase.prototype.constructor = ComponentBase;

/**
 * Insert child element
 * @param name - name of child (key in object of childes)
 * @param component - child component
 * @param wraper - object in format {el: parentElement} or {id: id} or {class: className}
 */
ComponentBase.prototype.addChild = function (name, component, wraper){
	if(this.childs[name]){
		console.log("Component with name: " + name + " already exists.");
	}
	else{
		this.childs[name] = {
			'component': component,
			'wrapper': wraper
		};
		this.setAsChild(this.childs[name].component);
	}
}

//Remove child component
ComponentBase.prototype.removeChild = function (name){
	if(this.childs[name]){
		delete this.childs[name];
	}
	else {
		console.log("Component with name: " + name + " is not parrent of this component.");
	}
}

ComponentBase.prototype.removeFromDOM = function (){
	//check if its rendered
	if(this.rendered){
		this.element.remove();
		for(var child in this.childs){
			this.childs[child].component.removeFromDOM();
		}
		
		this.rendered = false;
	}
	
}

//Delete elements of component including listeners
ComponentBase.prototype.destroy = function (){
	//check if its rendered
	this.removeFromDOM();
	this.removeListeners(this.componentId);
	for(var name in this.childs){
		
		this.childs[name].component.destroy();
		delete this.childs[name];
		
	}
	
}

// Prepare element
ComponentBase.prototype.createDom = function (){
	this.element = document.createElement("div");
}

// Returns element
ComponentBase.prototype.getElement = function (){
	if(this.element == null){
		this.createDom();
	}
	return this.element;
}

// Renders and insert component into dom (including child)
ComponentBase.prototype.render = function (parrent){

    var element = this.getElement();
    parrent = this.getWrapper(parrent);
    parrent.appendChild(element);

    this.rendered = true;

    var child , parrentOfChild;
    for(var name in this.childs){
        parrentOfChild = element;
        child = this.childs[name];
        if(child.wrapper){
            if(child.wrapper['el']){
                parrentOfChild = this.helper.obj.getData(child.wrapper, ['el']);
            }
            else if(child.wrapper['id']){
                parrentOfChild = document.getElementById(this.helper.obj.getData(child.wrapper, ['id']));
            }
            else if(child.wrapper['class']){
                parrentOfChild = document.getElementsByClassName(this.helper.obj.getData(child.wrapper, ['class']))[0];
            }
        }
        child.component.render(parrentOfChild);

    }
}

//Check if wrapper exists. If wrapper doesnt exists create general wrapper
ComponentBase.prototype.getWrapper = function(wrapper){
    if(wrapper == null){
        return document.getElementById(ComponentBase.mainWrapper);
    }
    return wrapper;
};

ComponentBase.prototype.setModel = function(model, eventType) {
	this.model = model;
	this.listen(eventType, model, this.onLoad);
}

ComponentBase.prototype.onLoad = function(data) {

}

ComponentBase.mainWrapper = "main-wrapper";
ComponentBase.EventType = {
	CLICK: "click",
	CHANGE: "change"
}

