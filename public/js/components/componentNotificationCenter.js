(function() {
  var ComponentNotificationCenter;

  ComponentNotificationCenter = (function() {
    function ComponentNotificationCenter() {
      this._countOfNotifications = 0;
      this.render(document.getElementById('navbar'));
    }

    ComponentNotificationCenter.prototype.addNewNotification = function(element, duration, type) {
      var newDiv, wrapper;
      if (typeof element === "string") {
        wrapper = document.createElement('div');
        wrapper.innerHTML = element;
        element = wrapper;
      }
      newDiv = document.createElement('div');
      newDiv.className = type != null ? type : ComponentNotificationCenter.EventType.neutral;
      newDiv.appendChild(element);
      this._countOfNotifications++;
      if (this._countOfNotifications === 1) {
        setTimeout((function(_this) {
          return function() {
            return _this.element.classList.remove('deactivated');
          };
        })(this), 0);
      }
      this.element.appendChild(newDiv);
      setTimeout((function(_this) {
        return function() {
          return _this._hide(newDiv);
        };
      })(this), duration);
    };

    ComponentNotificationCenter.prototype._hide = function(newDiv) {
      this._countOfNotifications--;
      if (!this._countOfNotifications) {
        this.element.classList.add("deactivated");
      }
      this.element.removeChild(newDiv);
    };

    ComponentNotificationCenter.prototype.createDom = function() {
      var wrapper;
      wrapper = document.createElement('div');
      wrapper.className = "notification-center deactivated";
      this.element = wrapper;
    };

    ComponentNotificationCenter.prototype.render = function(wrapper) {
      if (!this.element) {
        this.createDom();
      }
      return wrapper.appendChild(this.element);
    };

    ComponentNotificationCenter.prototype.isOpened = function() {
      return !!this._countOfNotifications;
    };

    return ComponentNotificationCenter;

  })();

  ComponentNotificationCenter.EventType = {
    success: 'notification-success',
    neutral: 'notification-neutral',
    error: 'notification-error'
  };

  ComponentNotificationCenter.DEFAULT_TIME = 3000;

  module.exports = ComponentNotificationCenter;

}).call(this);
