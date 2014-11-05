(function() {
  var Router, app, router;

  app = require('./app');

  Router = require('./router/router');

  router = null;

  (function() {
    var storedHash;
    $.get("/handshake", function(data) {
      if (!data.error) {
        app.bulk = data.data;
        router = new Router();
        return router.init();
      }
    });
    if (window.onhashchange == null) {
      window.onhashchange = function() {
        if (router != null) {
          return router.changeView();
        }
      };
    } else {
      storedHash = window.location.hash;
      window.setInterval(function() {
        if (window.location.hash !== storedHash) {
          if (router != null) {
            return router.changeView();
          }
        }
      }, 100);
    }
  })();

}).call(this);
