(function() {
  var Observer,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Observer = (function() {
    function Observer() {
      this.subscribers = {};
      this.mapOfComponents = {};
    }

    Observer.prototype.fire = function(type, data, src) {
      var id, parents;
      parents = this.getParents(src);
      while (parents.length > 0) {
        id = parents.pop();
        if (this.subscribers[type] && this.subscribers[type][id]) {
          this.subscribers[type][id](data, src);
        }
      }
    };

    Observer.prototype.getParents = function(childId) {
      var iter, parents;
      parents = [];
      iter = childId;
      while (iter) {
        parents.push(iter);
        iter = this.mapOfComponents[iter];
      }
      return parents;
    };

    Observer.prototype.on = function(type, fn, owner) {
      var typeItem;
      if (typeof fn !== "function") {
        return;
      }
      if (this.subscribers[type] === void 0) {
        this.subscribers[type] = {};
      }
      typeItem = this.subscribers[type];
      if (typeItem[owner.componentId] === void 0) {
        typeItem[owner.componentId] = {};
      }
      typeItem[owner.componentId] = fn;
    };

    Observer.prototype.removeListener = function(listenerId) {
      var itemEvent, _i, _len, _ref;
      _ref = this.subscribers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        itemEvent = _ref[_i];
        if (__indexOf.call(this.subscribers[itemEvent], listenerId) >= 0) {
          delete this.subscribers[itemEvent][listenerId];
        }
      }
    };

    return Observer;

  })();

  module.exports = Observer;

}).call(this);
