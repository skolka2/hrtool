var ViewBase =  require('./viewBase');
var ComponentFormAddUser = require('../components/forms/componentFormAddUser');

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
	viewWrapper.innerTHTML = "People Admin View";

    var divForm = document.createElement('div');
    divForm.innerHTML = "<br/><br/><br/><br/>ComponentFormAddUser...<br><br>";
    viewWrapper.appendChild(divForm);

    var form = new ComponentFormAddUser();
    form.render(divForm);

	mainWrapper.appendChild(viewWrapper);
}