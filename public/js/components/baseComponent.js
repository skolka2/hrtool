var ComponentBase;



//Default constructor
ComponentBase = function(){
	this.super = EventEmitter;
	this.super.prototype.constructor.call(this);
    this.helper = helper;
	this.childs = {};
	this.element = null;
	this.rendered = false;
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
		for(child in this.childs){
			this.childs[child].component.removeFromDOM();
			this.element.remove();
		}
		
		this.rendered = false;
	}
	
}

//Delete elements of component including listeners
ComponentBase.prototype.destroy = function (){
	//check if its rendered
	this.removeFromDOM();
	
	//TODO After obs is done remove from obs(listeners)
	for(name in this.childs){
		
		this.childs[name].component.destroy();
		delete this.childs[name];
		//Remove from obs
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
ComponentBase.prototype.render = function (wrapper){
	
	var element = this.getElement();
	wrapper = this.getWrapper(wrapper);
	var parrent = wrapper;
	parrent.appendChild(element);

	this.rendered = true;

	var child , parrentOfChild;
	parrentOfChild = element;
	/*var parrentWrapper = document.getElementById(wrapper.id);
	if(parrentWrapper != null){
		parrentOfChild = parrentWrapper;
	}
	else {
		parrentWrapper = document.getElementsByName(wrapper.className)[0];
		if(parrentWrapper!=null){
			parrentOfChild = parrentWrapper;
		}
	}*/
	for(name in this.childs){
		child = this.childs[name];
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