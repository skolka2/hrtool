var ViewBase =  require('./viewBase');

var ViewDepartmentAdmin =  module.exports = function() {
	ViewBase.call(this);
	this.super = ViewBase;
}

ViewDepartmentAdmin.prototype = new ViewBase();
ViewDepartmentAdmin.prototype.constructor = ViewDepartmentAdmin;

ViewDepartmentAdmin.prototype.render = function() {

	this.super.prototype.render.apply(this, arguments);
	var mainWrapper = document.getElementById(this.super.mainWrapper);

	var viewWrapper = document.createElement('div');
	viewWrapper.className = "view-wraper";
	viewWrapper.innerHTML = "Department Admin View";

	mainWrapper.appendChild(viewWrapper);
}