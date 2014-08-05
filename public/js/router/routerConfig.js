function getView(view) {
    switch (view) {
    case 'users':
            return users;
    case 'features':
        return features;
    default:
        return "/";
    }
}