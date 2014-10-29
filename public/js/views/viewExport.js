(function() {
  var ViewBase, ViewExport,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewBase = require('./viewBase');

  ViewExport = (function(_super) {
    __extends(ViewExport, _super);

    function ViewExport() {
      ViewExport.__super__.constructor.call(this);
    }

    ViewExport.prototype.render = function() {
      var mainWrapper, viewWrapper;
      ViewExport.__super__.render.call(this, arguments);
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      viewWrapper = document.createElement('div');
      viewWrapper.className = "view-wraper";
      viewWrapper.innerHTML = "Exports view";
      mainWrapper.appendChild(viewWrapper);
    };

    return ViewExport;

  })(ViewBase);

  module.exports = ViewExport;

}).call(this);
