var Router = function () { }

Router.prototype.init = function () {
    var path = this.getPath();
    this.routerConfig = new RouterConfig();
    this.view = this.routerConfig.setView(path);
    this.view.render();

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

