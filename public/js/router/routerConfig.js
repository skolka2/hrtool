var ViewHome = require('../views/viewHome');
var ViewDepartmentAdmin = require('../views/viewDepartmentAdmin');
var ViewPeopleAdmin = require('../views/viewPeopleAdmin');
var ViewTaskAdmin = require('../views/viewTaskAdmin');
var ViewTest =require('../views/viewTest');
var ViewDefault =require('../views/viewDefault');

var RouterConfig = module.exports = function () { }

RouterConfig.prototype.setView = function(data) {
    var curView;
    //if you wat to add parameters, use data.parameters
    switch (data.view) {
        case 'home':
            return curView = new ViewHome();
        case 'departmentAdmin':
            return curView = new ViewDepartmentAdmin();
        case 'peopleAdmin':
            return curView = new ViewPeopleAdmin();
        case 'taskAdmin':
            return curView = new ViewTaskAdmin();
        case 'test':
            return curView = new ViewTest();
        case 'test':
            return curView = new ViewTest();
        default:
            return new ViewHome();
    }
}