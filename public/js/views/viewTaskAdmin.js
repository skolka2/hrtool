var ViewBase =  require('./viewBase');
var ComponentAddTask = require('../components/features/addTask/newTask/componentAddTask');
var ComponentHide = require('../components/features/componentHide');
var helper = require('../helpers/helpers');
var ComponentTemplateListFactory = require('../components/templateList/componentTemplateListFactory');
var ComponentTaskImplicit = require('../components/features/addTask/componentTaskImplicit');
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

    this.componentTemplateList = new ComponentTemplateListFactory.createAll();
    var dataForImplicit = {id_task_template: 5, id_department: 2, id_team: 3, title: "title example"};
    this.componentTaskImplicit = new ComponentTaskImplicit(dataForImplicit);
    var implicitWrapper = document.createElement('div');
    var hideImplicit = new ComponentHide(helper.dom.createElement("<span>Insert new implicit task(still example data)</span>"), implicitWrapper, false);
    viewWrapper.appendChild(implicitWrapper);
    var templateWrapper = document.createElement('div');
    var hideTemplate = new ComponentHide(helper.dom.createElement("<span>Show template tasks</span>"), templateWrapper, false);
    this.componentTaskImplicit.render(implicitWrapper);
    this.componentTemplateList.render(templateWrapper);
    hideImplicit.render(viewWrapper);
    hideTemplate.render(viewWrapper);
	mainWrapper.appendChild(viewWrapper);
}