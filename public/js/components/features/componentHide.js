(function() {
  var ComponentBase, ComponentHide,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../componentBase');

  ComponentHide = (function(_super) {
    __extends(ComponentHide, _super);

    function ComponentHide(headlineEl, content, closed) {
      this.headlineEl = headlineEl;
      this.content = content;
      this.closed = closed != null ? closed : false;
      this.handleHide = __bind(this.handleHide, this);
      ComponentHide.__super__.constructor.call(this);
      this.headTitle = null;
      this.arrow = null;
      this.contentEl = this.content;
    }

    ComponentHide.prototype.createDom = function() {
      var head, wrapper;
      wrapper = document.createElement("div");
      wrapper.className = "hide-comp";
      head = document.createElement("div");
      head.className = "hide-head";
      this.headTittle = document.createElement("div");
      this.headTittle.className = "hide-tittle";
      this.setHeader(this.headlineEl);
      this.arrow = document.createElement("div");
      this.arrow.className = "hide-arrow";
      this.arrow.addEventListener(ComponentBase.eventType.CLICK, this.handleHide, false);
      head.appendChild(this.headTittle);
      head.appendChild(this.arrow);
      this.setContent(this.contentEl);
      wrapper.appendChild(head);
      wrapper.appendChild(this.content);
      this.element = wrapper;
      this.setVisibility(this.closed);
    };

    ComponentHide.prototype.handleHide = function() {
      this.closed = !this.closed;
      this.setVisibility(this.closed);
      if (this.closed === true) {
        this.fire(ComponentHide.eventType.REMOVE, this.componentId);
      } else {
        this.fire(ComponentHide.eventType.RENDER, this.componentId);
      }
    };

    ComponentHide.prototype.setVisibility = function(show) {
      if (!show) {
        this.content.className = "hide-content";
        this.arrow.innerHTML = "<span>HIDE</span><div>" + ComponentHide.Arrows.DOWN + "</div>";
      } else {
        this.content.className = "hide-content hidden";
        this.arrow.innerHTML = "<span>SHOW</span><div>" + ComponentHide.Arrows.UP + "</div>";
      }
    };

    ComponentHide.prototype.setContent = function(content) {
      if (this.content != null) {
        this.content = document.createElement("div");
        this.content.className = 'hide-content';
      } else {
        while (this.content.firstChild !== null) {
          this.content.removeChild(this.content.firstChild);
        }
      }
      this.content.appendChild(content);
    };

    ComponentHide.prototype.setHeader = function(header) {
      while (this.headTittle.firstChild != null) {
        this.headTittle.removeChild(this.headTittle.firstChild);
      }
      return this.headTittle.appendChild(header);
    };

    ComponentHide.prototype.getContentWrapper = function() {
      this.getElement();
      return this.content;
    };

    ComponentHide.prototype.render = function(wrapper) {
      ComponentHide.__super__.render.call(this, wrapper);
      if (this.closed === true) {
        this.setVisibility(this.closed);
      }
    };

    return ComponentHide;

  })(ComponentBase);

  ComponentHide.eventType = {
    REMOVE: "childsRemoved",
    RENDER: "childsRendered"
  };

  ComponentHide.Arrows = {
    UP: "&#8744",
    DOWN: "&#8743"
  };

  module.exports = ComponentHide;

}).call(this);
