var ComponentHide = function(header,content, closed){
    ComponentBase.call(this);
    this.super = ComponentBase;

    //TODO content apend
    // Header element
    this.headerText = header || "";
    // Is it closed?
    this.closed = !!closed;
    this.header= this.content = this.arrow = null;
    this.dataEl = content;
}

ComponentHide.prototype = new ComponentBase();
ComponentHide.prototype.constructor = ComponentHide;

// Creates Dom
ComponentHide.prototype.createDom = function(){
	var wrapper = document.createElement("div");
	wrapper.className = "hide-comp";

	var head =  document.createElement("div");
	head.className = "hide-head";

	this.header = document.createElement("div");
	this.header.className = "hide-header";

	this.setHeader(this.headerText);
	this.arrow = document.createElement("div");
	this.arrow.className = "hide-arrow";

	this.setArrow(this.closed);
	this.arrow.addEventListener(ComponentBase.EventType.CLICK,this.handleHide.bind(this),false);

	this.content = document.createElement("div");
	this.content.id = 'hide-content'+this.componentId;
	this.content.className = 'hide-content';
	this.content.appendChild(this.dataEl);

	head.appendChild(this.header);
	head.appendChild(this.arrow);

	wrapper.appendChild(head);
	wrapper.appendChild(this.content);

	this.element = wrapper;
} 

// Hides or shows childs.
ComponentHide.prototype.handleHide = function(){
	this.closed = !this.closed;
	this.setArrow(this.closed);

	if(this.closed){
		this.hideContent();
		this.fire(ComponentHide.EventType.REMOVE,this.componentId);
	}
	else{
		this.showContent();
		this.fire(ComponentHide.EventType.RENDER,this.componentId);
	}
}
// Hide childs 
ComponentHide.prototype.hideContent = function(){
	this.content.className = "hide-content hidden";
}
// Shows childs
ComponentHide.prototype.showContent = function(){
	this.content.className = "hide-content";	
}
// Sets header of component
ComponentHide.prototype.setHeader = function(header){
	while(this.header.firstChild){
	    this.header.removeChild(this.header.firstChild);
	}
	this.header.appendChild(header);
} 
// Gets wrapper for content
ComponentHide.prototype.getContentWrapper = function(){
	this.getElement();
	return this.content;
} 
// Sets arrow of component
ComponentHide.prototype.setArrow = function(down){
	if(down){
		this.arrow.innerHTML = "&#8744;";
	}
	else{
		this.arrow.innerHTML = "&#8743;";
	}
}
// Renders component, hides childs if they should be hidden.
ComponentHide.prototype.render = function(wrapper){
	this.super.prototype.render.call(this,wrapper);
	if(this.closed){
		this.hideContent();
	}
}
// Event Types.
ComponentHide.EventType = 
{
	REMOVE:"childsRemoved",
	RENDER:"childsRendered"
}