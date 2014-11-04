(function() {
  var ComponentNavBar, EventEmitter, ViewBase, helper,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('../observer/ObservableComponent');

  helper = require('../helpers/helpers');

  ComponentNavBar = require('../components/componentNavBar');

  ViewBase = (function(_super) {
    __extends(ViewBase, _super);

    function ViewBase() {
      ViewBase.__super__.constructor.call(this);
      this.helper = helper;
    }

    ViewBase.mainWrapper = "main-wrapper";

    ViewBase.prototype.render = function() {
      var baseEl, body, div, navBar;
      navBar = new ComponentNavBar();
      navBar.render();
      baseEl = document.getElementById(ViewBase.mainWrapper);
      if (baseEl) {
        while (baseEl.childNodes.length > 0) {
          baseEl.removeChild(this.baseEl.childNodes[0]);
        }
      } else {
        body = document.getElementsByTagName("body")[0];
        div = document.createElement("div");
        div.id = ViewBase.mainWrapper;
        body.appendChild(div);
      }
    };

    return ViewBase;

  })(EventEmitter);

  module.exports = ViewBase;

}).call(this);
