


//BaseView = require("./baseView.js");


var DefaultView = function(){
	this.super = BaseView;
	this.super.call(this,null);
}
DefaultView.prototype = new BaseView();
DefaultView.prototype.constructor = DefaultView;

DefaultView.prototype.render = function(){
	this.super.prototype.render.apply(this, arguments);
	var mainWrapper = document.getElementById(this.super.mainWrapper);
	var div = document.createElement("div");
	div.id = "DefaultView";
	div.innerText = "This is default view, you should not be seeing this (you should see other views instead).";
	mainWrapper.appendChild(div);
};




