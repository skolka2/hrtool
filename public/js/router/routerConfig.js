var RouterConfig = function () { }

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
        case 'checkbox':
            return curView = new ViewTestCheckBox();
        default:
            return new ViewDefault();
    }
}