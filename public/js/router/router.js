
var Router = function () { }

    Router.prototype.init = function () {
    var obj = this.getPath();
        //console.log(obj.view);
        getView(obj.view);

    }
    Router.prototype.getPath = function() {

        var url = window.location.hash;
        if(url != ""){
        var map = [];
        var tmpUrl = url.split('?');
            //get parameters
            var params = tmpUrl.pop();
            var vars = params.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                map[pair[0]] = pair[1];
            }
            //get views
            var view = tmpUrl.pop().substring(1);
            return { view: view, parameters: map };
        }
        else return "";
    }

