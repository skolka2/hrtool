var ViewManager = function() {
	ViewBase.call(this);
	this.super = ViewBase;
}

ViewManager.prototype = new ViewBase();
ViewManager.prototype.constructor = ViewManager;

ViewManager.prototype.render = function() {

	this.super.prototype.render.apply(this, arguments);
	var mainWrapper = document.getElementById(this.super.mainWrapper);

	var viewWrapper = document.createElement('div');
	viewWrapper.className = "view-wraper";

	mainWrapper.appendChild(viewWrapper);
}