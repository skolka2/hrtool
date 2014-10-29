(function() {
  var ViewBase, ViewTest,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewBase = require('./viewBase');

  ViewTest = (function(_super) {
    __extends(ViewTest, _super);

    function ViewTest() {
      ViewTest.__super__.constructor.call(this);
    }

    ViewTest.prototype.render = function() {
      var div, mainWrapper;
      ViewTest.__super__.render.call(this, arguments);
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      div = document.createElement("div");
      div.id = "ViewDefault";
      div.innerText = "This is view for testing.";
      mainWrapper.appendChild(div);
    };

    return ViewTest;

  })(ViewBase);

  module.exports = ViewTest;

}).call(this);
