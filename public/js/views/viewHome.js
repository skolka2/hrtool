var ViewBase =  require('./viewBase');
var Const = require('../helpers/constants');
var helper = require('../helpers/helpers');
var ComponentTaskListsInView = require('../components/tasks/componentTaskListsInView');
var ComponentTaskListFactory = require('../components/tasks/componentTaskListFactory');


var ViewHome = module.exports =  function() {
	ViewBase.call(this);
	this.super = ViewBase;
}

ViewHome.prototype = new ViewBase();
ViewHome.prototype.constructor = ViewHome;

ViewHome.prototype.render = function() {

	this.super.prototype.render.apply(this, arguments);
	var mainWrapper = document.getElementById(this.super.mainWrapper);
	var viewWrapper = document.createElement('div');
    var userRole = helper.bulk.getData(["user", "id_user_role"]);
	viewWrapper.className = "view-wraper";
	viewWrapper.innerHTML = "Home View";

	var userTaskLists = new ComponentTaskListsInView("Your tasks:", ComponentTaskListFactory.UserTaskList.createCompleted, ComponentTaskListFactory.UserTaskList.createNotCompleted);
	userTaskLists.render(viewWrapper);

	var buddyTaskLists = new ComponentTaskListsInView("Tasks, for which you are buddy:", ComponentTaskListFactory.BuddyTaskList.createCompleted, ComponentTaskListFactory.BuddyTaskList.createNotCompleted);
	buddyTaskLists.render(viewWrapper);

    if(userRole == Const.TEAM_MANAGER || userRole == Const.ADMINISTRATOR)
    {
        var managerTaskLists = new ComponentTaskListsInView("Tasks of people from your departments/teams:", ComponentTaskListFactory.ManagerTaskList.createCompleted, ComponentTaskListFactory.ManagerTaskList.createNotCompleted, true);
    	managerTaskLists.render(viewWrapper);
    }

    mainWrapper.appendChild(viewWrapper);
};
