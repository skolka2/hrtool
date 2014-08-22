var RouterConfig = function () { }

RouterConfig.prototype.setView = function(data) {
    var curView;
    //if you wat to add parameters, use data.parameters
    switch (data.view) {
        case 'home':
            return curView = new ViewHome();
        case 'manager':
            return curView = new ViewManager();
        case 'peopleAdmin':
            return curView = new ViewPeopleAdmin();
        case 'taskAdmin':
            return curView = new ViewTaskAdmin();
        default:
            return new ViewHome();
    }
}