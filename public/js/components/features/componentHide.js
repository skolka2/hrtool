var ComponentBase = require('../componentBase');

var ComponentHide  = module.exports = function(header,content, closed){
    ComponentBase.call(this);
    this.super = ComponentBase;


    // Header element
    this.headlineEl  = header;
    // Is it closed?
    this.closed = !!closed;
    this.headTittle= this.arrow = null;
   	this.contentEl = content;
}

ComponentHide.prototype = new ComponentBase();
ComponentHide.prototype.constructor = ComponentHide;

// Creates Dom
ComponentHide.prototype.createDom = function(){
	var wrapper = document.createElement("div");
	wrapper.className = "hide-comp";

	var head =  document.createElement("div");
	head.className = "hide-head";


	this.headTittle = document.createElement("div");
	this.headTittle.className = "hide-tittle";

	this.setHeader(this.headlineEl );

	this.arrow = document.createElement("div");
	this.arrow.className = "hide-arrow";

	this.arrow.addEventListener(ComponentBase.EventType.CLICK,this.handleHide.bind(this),false);

	head.appendChild(this.headTittle);
	head.appendChild(this.arrow);

	this.setContent(this.contentEl);


	wrapper.appendChild(head);
	wrapper.appendChild(this.content);

	this.element = wrapper;

	this.setVisibility(this.closed);
	
} 

// Hides or shows childs.
ComponentHide.prototype.handleHide = function(){
	this.closed = !this.closed;

	this.setVisibility(this.closed);
	if(this.closed){	
		this.fire(ComponentHide.EventType.REMOVE,this.componentId);
	}
	else{
		this.fire(ComponentHide.EventType.RENDER,this.componentId);
	}
}
// Changes visibility of content and changes arrow
ComponentHide.prototype.setVisibility = function(show){
	if(!show){
		this.content.className = "hide-content";
		this.arrow.innerHTML = "<span>HIDE</span><div>" + ComponentHide.Arrows.DOWN + "</div>";
	}
	else {
		this.content.className = "hide-content hidden";
		this.arrow.innerHTML = "<span>SHOW</span><div>" + ComponentHide.Arrows.UP + "</div>";
	}
}

// Sets content
ComponentHide.prototype.setContent = function(content){
	if(this.content == null){
		this.content = document.createElement("div");
		this.content.className = 'hide-content';
	}
	else{
		while(this.content.firstChild){
		    this.content.removeChild(this.content.firstChild);
		}
	}
	this.content.appendChild(content);
}
// Sets header of component
ComponentHide.prototype.setHeader = function(header){
	while(this.headTittle.firstChild){
	    this.headTittle.removeChild(this.headTittle.firstChild);
	}
	this.headTittle.appendChild(header);
} 
// Gets wrapper for content
ComponentHide.prototype.getContentWrapper = function(){
	this.getElement();
	return this.content;
}


// Renders component, hides childs if they should be hidden.
ComponentHide.prototype.render = function(wrapper){
	this.super.prototype.render.call(this,wrapper);
	if(this.closed){
		this.setVisibility(this.closed);
	}
}
// Event Types.
ComponentHide.EventType = 
{
	REMOVE:"childsRemoved",
	RENDER:"childsRendered"
}

ComponentHide.Arrows = {
	UP: "&#8744;",
	DOWN: "&#8743;"
}