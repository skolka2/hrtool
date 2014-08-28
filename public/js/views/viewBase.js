var ViewBase =	function(){

	EventEmitter.apply(this);
	this.super = EventEmitter;
	this.helper = helper;
}	

ViewBase.prototype = new EventEmitter();
ViewBase.prototype.constructor = ViewBase;


ViewBase.prototype.render = function(){
    var navBar = new ComponentNavBar();
    navBar.render();

	this.base = document.getElementById(ViewBase.mainWrapper);
	if(this.base != null){ //checks if, in body, exists main-wrapper
		while( this.base.childNodes.length > 0 ){
     		this.base.removeChild(this.base.childNodes[0])
		}
	}
	else{	//Adds main-wrapper
		var body = document.getElementsByTagName("body")[0];
		var div = document.createElement("div");
		div.id = ViewBase.mainWrapper;
		body.appendChild(div);
	}
};

ViewBase.mainWrapper = "main-wrapper";
