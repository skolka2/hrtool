var ComponentBase;



//Default constructor
ComponentBase = function(){
	this.childs = {};
	this.element = null;
	this.rendered = false;
	ComponentBase.componentID = 0;
	ComponentBase.mainWrapper = "main-wrapper";
}

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

ComponentBase.prototype.destroyFromDOM = function (){
	//check if its rendered
	if(this.rendered){
		var parentElement = this.getElement().parentElement; //Since I know parent element of this node, i can delete it completely(itself) from DOM
		parentElement.removeChild(this.getElement());
	}
	else{
		console.log("You cannnot delete this element from DOM, because its not rendered yet.");
	}
}

//Delete elements of component including listeners
ComponentBase.prototype.destroy = function (){
	//check if its rendered
	this.destroyFromDOM();
	if(this.rendered){
		//TODO After obs is done remove from obs(listeners)
		for(name in this.childs){
			
			this.childs[name].component.destroy();
			delete this.childs[name];
			//Remove from obs
		}
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
		return this.element;
	}
	return this.element;
}

// Renders and insert component into dom (including child)
ComponentBase.prototype.render = function (wrapper){
	
	var element = this.getElement();
	wrapper = this.getWrapper(wrapper);
	var parrent = wrapper;
	element.parentNode = parrent;

	parrent.appendChild(element);

	this.rendered = true;

	var child , parrentOfChild;
	parrentOfChild = element;
	for(name in this.childs){
		child = this.childs[name];
		child.component.render(parrentOfChild);
	}
}

//Check if wrapper exists. If wrapper doesnt exists create general wrapper
ComponentBase.prototype.getWrapper = function(wrapper){
	if(wrapper == null){		
		return document.getElementById("main-wrapper");
	}
	return wrapper;
}