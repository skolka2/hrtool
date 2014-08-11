var RouterConfig = function () { }

RouterConfig.prototype.setView = function(data) {
    var curView;
    //if you wat to add parameters, use data.parameters
    switch (data.view) {
        case 'users':
            return curView = UserView();
        case 'features':
            return curView = new FeatureView();
        default:
            return curView = new DefaultView();
    }
}