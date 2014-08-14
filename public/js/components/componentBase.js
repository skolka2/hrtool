//Default constructor
var ComponentBase = function(){
	this.super = EventEmitter;
	this.super.prototype.constructor.apply(this);
	this.childs = {};
	this.element = null;
	this.rendered = false;

	this.helper = helper;
}

ComponentBase.prototype = new EventEmitter();
ComponentBase.prototype.constructor = ComponentBase;

//Insert child component
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
			var parrentWrapper = document.getElementById(child.wrapper.id);
			if(parrentWrapper != null){
				parrentOfChild = parrentWrapper;
			}
			else {
				parrentWrapper = document.getElementsByClassName(child.wrapper.className)[0];
				if(parrentWrapper!=null){
					parrentOfChild = parrentWrapper;
				}
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
}

ComponentBase.mainWrapper = "main-wrapper";
ComponentBase.EventType = {
	CLICK: "click"
}
