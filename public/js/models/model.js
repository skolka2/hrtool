(function() {
  var EventEmitter, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('../observer/ObservableComponent');

  Model = (function(_super) {
    __extends(Model, _super);

    function Model(eventType) {
      this.eventType = eventType;
      Model.__super__.constructor.call(this);
      this.data = null;
    }

    Model.prototype.update = function(data) {
      this.data = data;
      this.onUpdate();
    };

    Model.prototype.onUpdate = function() {
      this.fire(this.eventType, this.data);
    };

    return Model;

  })(EventEmitter);

  module.exports = Model;

}).call(this);
