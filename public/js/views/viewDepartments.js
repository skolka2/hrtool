(function() {
  var ViewBase, ViewDepartments,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewBase = require('./viewBase');

  ViewDepartments = (function(_super) {
    __extends(ViewDepartments, _super);

    function ViewDepartments() {
      ViewDepartments.__super__.constructor.call(this);
    }

    ViewDepartments.prototype.render = function() {
      var mainWrapper, viewWrapper;
      ViewDepartments.__super__.render.call(this);
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      viewWrapper = document.createElement('div');
      viewWrapper.className = "view-wraper";
      viewWrapper.innerHTML = "Department Admin View";
      mainWrapper.appendChild(viewWrapper);
    };

    return ViewDepartments;

  })(ViewBase);

  module.exports = ViewDepartments;

}).call(this);
