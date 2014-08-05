var App = function() {
   
}
App.prototype.initRouter = function () {
    this.router = Router.init();
}

window.onload = function() {

    var app = new App();
    app.initRouter();
};
