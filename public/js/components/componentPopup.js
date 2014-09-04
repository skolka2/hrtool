(function() {
  var ComponentBase, ComponentPopup,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require("./componentBase");

  module.exports = ComponentPopup = (function(_super) {
    __extends(ComponentPopup, _super);

    function ComponentPopup(triggerEl, insideComponent) {
      this.triggerEl = triggerEl;
      this.insideComponent = insideComponent;
      this.handleOuterClick = __bind(this.handleOuterClick, this);
      this.open = __bind(this.open, this);
      ComponentPopup.__super__.constructor.call(this);
      this.insideEl = this.insideComponent.element;
      this.triggerEl.addEventListener(ComponentBase.CLICK_EVENT, this.open, false);
      this.rendered = false;
    }

    ComponentPopup.prototype.open = function() {
      var popup, popups, _i, _len;
      popups = document.getElementsByClassName('popup-container');
      for (_i = 0, _len = popups.length; _i < _len; _i++) {
        popup = popups[_i];
        popup.style.display = 'none';
      }
      this.mainDiv.classList.add('popup-opened');
      this.container.style.display = 'block';
      this.mainDiv.addEventListener(ComponentBase.CLICK_EVENT, this.handleOuterClick, false);
      return this.fire(ComponentPopup.eventType.OPEN, {});
    };

    ComponentPopup.prototype.handleOuterClick = function(ev) {
      if (!this.innerDiv.contains(ev.target)) {
        return this.mainDiv.classList.remove('popup-opened');
      }
    };

    ComponentPopup.prototype.close = function() {
      return this.fire(ComponentPopup.eventType.CLOSE, {});
    };

    ComponentPopup.prototype.createDom = function() {
      this.mainDiv = document.getElementById('popup-wrapper');
      this.container = document.createElement('div');
      this.innerDiv = document.createElement('div');
      this.closeCrossDiv = document.createElement('div');
      this.container.className = 'popup-container';
      this.innerDiv.className = 'popup-inner';
      this.closeCrossDiv.className = 'popup-close-cross';
      this.addChild('popup_' + this.insideComponent.componentId, this.insideComponent, {
        'el': this.innerDiv
      });
      this.container.appendChild(this.innerDiv);
      this.container.appendChild(this.closeCrossDiv);
      return this.element = this.container;
    };

    ComponentPopup.eventType = {
      CLOSE: 'popup_close',
      OPEN: 'popup-open'
    };

    return ComponentPopup;

  })(ComponentBase);

}).call(this);
