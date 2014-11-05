(function() {
  var ComponentBase, ComponentPopup,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require("./componentBase");

  ComponentPopup = (function(_super) {
    __extends(ComponentPopup, _super);

    function ComponentPopup(insideComponent) {
      this.insideComponent = insideComponent;
      this.open = __bind(this.open, this);
      ComponentPopup.__super__.constructor.call(this);
      this.insideEl = this.insideComponent.element;
      this.rendered = false;
      this.mainDiv = document.getElementById('popup-wrapper');
      this.opened = false;
      return;
    }

    ComponentPopup.prototype.open = function(ev) {
      this._prepare();
      this.opened = true;
      this.mainDiv.classList.add('popup-opened');
      this.container.style.display = 'block';
      this.fire(ComponentPopup.eventType.OPEN, {});
      this.handleOuterClickFn = (function(_this) {
        return function(ev) {
          if ((_this.innerDiv != null) && !_this.innerDiv.contains(ev.target)) {
            _this.close();
          }
        };
      })(this);
      this.mainDiv.addEventListener(ComponentBase.eventType.CLICK, this.handleOuterClickFn, false);
    };

    ComponentPopup.prototype.close = function() {
      this.container.style.display = 'none';
      this.insideComponent.destroy();
      this.mainDiv.removeEventListener(ComponentBase.eventType.CLICK, this.handleOuterClickFn, false);
      this.mainDiv.classList.remove('popup-opened');
      while (this.mainDiv.firstChild) {
        this.mainDiv.removeChild(this.mainDiv.firstChild);
      }
      this.fire(ComponentPopup.eventType.CLOSE, {});
    };

    ComponentPopup.prototype.createDom = function() {};

    ComponentPopup.prototype._prepare = function() {
      this.container = document.createElement('div');
      this.container.className = 'popup-container';
      this.innerDiv = document.createElement('div');
      this.innerDiv.className = 'popup-inner';
      this.closeCrossDiv = document.createElement('div');
      this.closeCrossDiv.className = 'popup-close-cross';
      this.addChild('popup_' + this.insideComponent.componentId, this.insideComponent);
      this.insideComponent.render(this.innerDiv);
      this.container.appendChild(this.innerDiv);
      this.container.appendChild(this.closeCrossDiv);
      this.element = this.container;
      this.mainDiv.appendChild(this.container);
    };

    return ComponentPopup;

  })(ComponentBase);

  ComponentPopup.eventType = {
    CLOSE: 'popup_close',
    OPEN: 'popup-open'
  };

  module.exports = ComponentPopup;

}).call(this);
