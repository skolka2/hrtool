var ViewHome = function() {
	ViewBase.call(this);
	this.super = ViewBase;

	this.buddyTaskLists = new ComponentBuddyTasksListsInView();
}

ViewHome.prototype = new ViewBase();
ViewHome.prototype.constructor = ViewHome;

ViewHome.prototype.render = function() {

	this.super.prototype.render.apply(this, arguments);
	var mainWrapper = document.getElementById(this.super.mainWrapper);

	var viewWrapper = document.createElement('div');
	viewWrapper.className = "view-wraper";
	viewWrapper.innerHTML = "Home View";

	this.buddyTaskLists.render(viewWrapper);

	mainWrapper.appendChild(viewWrapper);
}