var RouterConfig = require('./routerConfig');
var ViewBase = require('../views/viewBase');
var ComponentBase = require('../components/componentBase');
var Router = module.exports = function () {
}

Router.prototype.init = function () {
    var path = this.getPath();
    this.routerConfig = new RouterConfig();
    this.changeView(path);

}
Router.prototype.getPath = function () {

    var url = window.location.hash;
    if (url != "") {
        var map = {};
        var output = {
            view: "", parameters: ""
        };
        var arr = url.split('?');
        //get parameters
        if (arr[1]) {
            var params = arr[1];
            var vars = params.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                map[pair[0]] = pair[1];
            }
            output['parameters'] = map;
        }
        //get views
        var index = arr[0].lastIndexOf('#');
        output['view'] = arr[0].substring(index + 1);
        return output;
    }
    else return { view: "", parameters: "" };
}

Router.prototype.changeView = function () {

    this.view = this.routerConfig.setView(this.getPath());
    var _this = this;
    var mainWrapper = document.getElementById(ViewBase.mainWrapper);
    if (mainWrapper != null) {
        mainWrapper.innerHTML = '';
        this.view.render();
    }
    else {
        document.addEventListener(ComponentBase.EventType.DOMContentLoaded, function () {
            document.removeEventListener(ComponentBase.EventType.DOMContentLoaded, arguments.callee, false);
            if (mainWrapper != null) {
                mainWrapper.innerHTML = '';
                _this.view.render();
            }
        }, false);
    }
};
