var ViewBase =  require('./viewBase');
var ComponentBuddyTasksListsInView = require('../components/tasksBuddy/componentBuddyTaskListsInView');
var Const = require('../helpers/constants');
var helper = require('../helpers/helpers');

var ViewHome = module.exports =  function() {
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
    var userRole = helper.bulk.getData(["user", "id_user_role"]);
	viewWrapper.className = "view-wraper";
	viewWrapper.innerHTML = "Home View";

    this.buddyTaskLists.render(viewWrapper);

    //TODO: tasklist
    if(userRole == Const.TEAM_MANAGER || userRole == Const.ADMINISTRATOR)
    {
        //TODO: manager tasklist
    }

    mainWrapper.appendChild(viewWrapper);
};
