(function() {
  var Mediator;

  Mediator = (function() {
    function Mediator() {}

    Mediator.prototype.getSocket = function() {
      if (!Mediator.socket) {
        Mediator.socket = io.connect();
      }
      return Mediator.socket;
    };

    Mediator.prototype.loadData = function(endpoint, params, model, transform) {
      this.getSocket().emit(endpoint, params, function(resp) {
        if (resp.error) {
          console.log("error: ", resp.error);
          model.update(resp.error);
        } else {
          if (transform) {
            resp.data = transform(resp.data);
          }
          model.update(resp.data);
        }
      });
    };

    return Mediator;

  })();

  module.exports = Mediator;

}).call(this);
