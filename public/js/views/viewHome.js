var ViewHome = function() {
	ViewBase.call(this);
	this.super = ViewBase;
}

ViewHome.prototype = new ViewBase();
ViewHome.prototype.constructor = ViewHome;

ViewHome.prototype.render = function() {

	this.super.prototype.render.apply(this, arguments);
	var mainWrapper = document.getElementById(this.super.mainWrapper);

	var viewWrapper = document.createElement('div');
	viewWrapper.className = "view-wraper";
	viewWrapper.innerHTML = "Home View";

	mainWrapper.appendChild(viewWrapper);
}