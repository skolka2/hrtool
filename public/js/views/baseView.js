

//TODO get elements from helper
var BaseView =	function(){
	this.super = ObservableComponent;
	this.super.prototype.constructor.apply(this);
}	

BaseView.prototype = new ObservableComponent();
BaseView.prototype.constructor = ComponentBase;


BaseView.prototype.render = function(){
	this.base = document.getElementById(BaseView.mainWrapper);
	if(typeof this.base != 'undefined'){ //checks if, in body, exists main-wrapper
		var childs = this.base.childNodes;
		var length = childs.length;
		for(var i = 0;i < length;i++){
			
			this.base.removeChild(childs[0]);	//Delete all content from main-wrapper
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
