(function() {
  var ViewBase, ViewDefault,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewBase = require('./viewBase');

  ViewDefault = (function(_super) {
    __extends(ViewDefault, _super);

    function ViewDefault() {
      ViewDefault.__super__.constructor.call(this);
    }

    ViewDefault.prototype.render = function() {
      var div, mainWrapper;
      ViewDefault.__super__.render.call(this);
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      div = document.createElement("div");
      div.id = "ViewDefault";
      div.innerText = "This is default view, you should not be seeing this (you should see other views instead).";
      mainWrapper.appendChild(div);
    };

    return ViewDefault;

  })(ViewBase);

  module.exports = ViewDefault;

}).call(this);
