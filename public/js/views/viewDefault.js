var ViewBase =  require('./viewBase');

var ViewDefault =  module.exports = function(){
	ViewBase.call(this,null);
	this.super = ViewBase;
}
ViewDefault.prototype = new ViewBase();
ViewDefault.prototype.constructor = ViewDefault;

ViewDefault.prototype.render = function(){
	this.super.prototype.render.apply(this, arguments);
	var mainWrapper = document.getElementById(this.super.mainWrapper);
	var div = document.createElement("div");
	div.id = "ViewDefault";
	div.innerText = "This is default view, you should not be seeing this (you should see other views instead).";
	mainWrapper.appendChild(div);
};