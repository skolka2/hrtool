(function() {
  var ViewBase, ViewDepartmentAdmin,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewBase = require('./viewBase');

  ViewDepartmentAdmin = (function(_super) {
    __extends(ViewDepartmentAdmin, _super);

    function ViewDepartmentAdmin() {
      ViewDepartmentAdmin.__super__.constructor.call(this);
    }

    ViewDepartmentAdmin.prototype.render = function() {
      var mainWrapper, viewWrapper;
      ViewDepartmentAdmin.__super__.render.call(this, arguments);
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      viewWrapper = document.createElement('div');
      viewWrapper.className = "view-wraper";
      viewWrapper.innerHTML = "Department Admin View";
      mainWrapper.appendChild(viewWrapper);
    };

    return ViewDepartmentAdmin;

  })(ViewBase);

  module.exports = ViewDepartmentAdmin;

}).call(this);
