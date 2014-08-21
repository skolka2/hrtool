var BaseView =	function(){

	EventEmitter.apply(this);
	this.super = EventEmitter;
	this.helper = helper;
}	

BaseView.prototype = new EventEmitter();
BaseView.prototype.constructor = BaseView;


BaseView.prototype.render = function(){
	this.base = document.getElementById(BaseView.mainWrapper);
	if(this.base != null){ //checks if, in body, exists main-wrapper
		while( this.base.childNodes.length > 0 ){
     		this.base.removeChild(this.base.childNodes[0])
		}
	}
	else{	//Adds main-wrapper
		var body = document.getElementsByTagName("body")[0];
		var div = document.createElement("div");
		div.id = BaseView.mainWrapper;
		body.appendChild(div);
	}
};

BaseView.mainWrapper = "main-wrapper";
