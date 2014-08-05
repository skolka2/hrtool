function getView(view) {
    var curView;
    switch (view) {
    case 'users':
        return curView = UserView();
    case 'features':
        return curView = new FeatureView();
        default:
            return curView = new DefaultView();
    }
}