(function() {
  var EventEmitter, Observer;

  Observer = require('./Observer');

  EventEmitter = (function() {
    function EventEmitter() {
      this.componentId = ++EventEmitter._componentId;
    }

    EventEmitter._componentId = 0;

    EventEmitter.getObserver = function() {
      if (!EventEmitter.observer) {
        EventEmitter.observer = new Observer();
      }
      return EventEmitter.observer;
    };

    EventEmitter.prototype.listen = function(type, src, fn) {
      fn = fn.bind(this);
      EventEmitter.getObserver().on(type, fn, src);
    };

    EventEmitter.prototype.fire = function(type, data) {
      EventEmitter.getObserver().fire(type, data, this.componentId);
    };

    EventEmitter.prototype.setAsChild = function(child) {
      EventEmitter.getObserver().mapOfComponents[child.componentId] = this.componentId;
    };

    EventEmitter.prototype.removeListeners = function(componentId) {
      if (EventEmitter.getObserver().mapOfComponents[componentId]) {
        delete EventEmitter.getObserver().mapOfComponents[componentId];
      }
      EventEmitter.getObserver().removeListener(componentId);
    };

    return EventEmitter;

  })();

  module.exports = EventEmitter;

}).call(this);
