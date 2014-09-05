var ComponentBuddyTasksListsInView = function() {
	ComponentBase.call(this);
	this.super = ComponentBase;
	this.listNotFinished = ComponentBuddyTaskListFactory.createNotCompleted();
	this.listFinished = ComponentBuddyTaskListFactory.createCompleted();
}

ComponentBuddyTasksListsInView.prototype = new ComponentBase();
ComponentBuddyTasksListsInView.prototype.constructor = ComponentBuddyTasksListsInView;

ComponentBuddyTasksListsInView.prototype.createDom = function() {

	var outerHideWrapper = document.createElement('div');
	outerHideWrapper.className = "outer-hide-wrapper";

	var listsWrapper = document.createElement('div');
	listsWrapper.className = "buddy-lists-wrapper";

	var notFinishedTasksWrapper = document.createElement('div');
	notFinishedTasksWrapper.className = "not-finished-tasks-wrapper";

	var finishedTasksWrapper = document.createElement('div');
	finishedTasksWrapper.className = "finished-tasks-wrapper";

	var hideAll = new ComponentHide(this.helper.dom.createElement('<h1 class="buddy-lists-title">Tasks, for which you are listed as buddy:</h1>'), listsWrapper, false);
	hideAll.render(outerHideWrapper);

	var hideNotFinished = new ComponentHide(this.helper.dom.createElement('<h2 class="not-finished-tasks-title">Tasks, which are still being worked on:</h2>'), notFinishedTasksWrapper, false);
	hideNotFinished.render(listsWrapper);

	this.listNotFinished.render(notFinishedTasksWrapper);

	var hideFinished = new ComponentHide(this.helper.dom.createElement('<h2 class="finished-tasks-title">Tasks, which have been already finished:</h2>'), finishedTasksWrapper, true);
	hideFinished.render(listsWrapper)

	this.listFinished.render(finishedTasksWrapper);

	this.element = outerHideWrapper;
}