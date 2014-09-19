var ViewBase =  require('./viewBase');
var ComponentAddTask = require('../components/features/addTask/newTask/componentAddTask');
var ComponentHide = require('../components/features/componentHide');
var helper = require('../helpers/helpers');

var ViewTaskAdmin =  module.exports = function() {
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
	viewWrapper.innerHTML = "Task Admin View";
    viewWrapper.appendChild(document.createElement('br'));

    var div = document.createElement('div');
    var component = new ComponentAddTask();
    component.render(div);
    var hide = new ComponentHide(helper.dom.createElement("<span>Insert new task</span>"), div, false);
    hide.render(viewWrapper);

	mainWrapper.appendChild(viewWrapper);
}