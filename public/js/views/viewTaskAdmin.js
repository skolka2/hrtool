var ViewTaskAdmin = function() {
	ViewBase.call(this);
	this.super = ViewBase;
}

ViewTaskAdmin.prototype = new ViewBase();
ViewTaskAdmin.prototype.constructor = ViewTaskAdmin;

ViewTaskAdmin.prototype.render = function() {

	this.super.prototype.render.apply(this, arguments);
	var mainWrapper = document.getElementById(this.super.mainWrapper);

	var viewWrapper = document.createElement('div');
	viewWrapper.className = "view-wraper";

	mainWrapper.appendChild(viewWrapper);
}