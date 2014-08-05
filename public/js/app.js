window.onload = function() {
    var App = function() {
        App.prototype.initRouter = function () {
            var router = Router.init();
        }
    }
    var app = new App();
    app.initRouter();
};