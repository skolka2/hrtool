var ViewBase =  require('./viewBase');

var ViewPeopleAdmin = module.exports = function() {
	ViewBase.call(this);
	this.super = ViewBase;
}

ViewPeopleAdmin.prototype = new ViewBase();
ViewPeopleAdmin.prototype.constructor = ViewPeopleAdmin;

ViewPeopleAdmin.prototype.render = function() {

	this.super.prototype.render.apply(this, arguments);
	var mainWrapper = document.getElementById(this.super.mainWrapper);

	var viewWrapper = document.createElement('div');
	viewWrapper.className = "view-wraper";
	viewWrapper.innerHTML = "People Admin View";

	mainWrapper.appendChild(viewWrapper);
}