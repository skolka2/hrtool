(function() {
  var ComponentBase, Router, RouterConfig, ViewBase;

  RouterConfig = require('./routerConfig');

  ViewBase = require('../views/viewBase');

  ComponentBase = require('../components/componentBase');

  Router = (function() {
    function Router() {}

    Router.prototype.init = function() {
      this.routerConfig = new RouterConfig();
      this.changeView();
    };

    Router.prototype.getPath = function() {
      var arr, index, map, output, pair, params, url, v, vars, _i, _len;
      url = window.location.hash;
      output = {
        view: "",
        parameters: ""
      };
      if (url !== "") {
        map = {};
        arr = url.split('?');
        if (arr[1]) {
          params = arr[1];
          vars = params.split("&");
          for (_i = 0, _len = vars.length; _i < _len; _i++) {
            v = vars[_i];
            pair = v.split("=");
            map[pair[0]] = pair[1];
          }
          output['parameters'] = map;
        }
        index = arr[0].lastIndexOf('#');
        output['view'] = arr[0].substring(index + 1);
      }
      return output;
    };

    Router.prototype.changeView = function() {
      var mainWrapper;
      this.view = this.routerConfig.setView(this.getPath());
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      if (mainWrapper) {
        mainWrapper.innerHTML = '';
        this.view.render();
      } else {
        document.addEventListener(ComponentBase.EventType.DOMContentLoaded, (function(_this) {
          return function() {
            document.removeEventListener(ComponentBase.EventType.DOMContentLoaded, arguments.callee, false);
            if (mainWrapper) {
              mainWrapper.innerHTML = '';
              return _this.view.render();
            }
          };
        })(this), false);
      }
    };

    return Router;

  })();

  module.exports = Router;

}).call(this);
