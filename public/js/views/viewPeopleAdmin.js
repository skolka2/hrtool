(function() {
  var ComponentFormAddUser, ViewBase, ViewPeopleAdmin,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewBase = require('./viewBase');

  ComponentFormAddUser = require('../components/forms/componentFormAddUser');

  ViewPeopleAdmin = (function(_super) {
    __extends(ViewPeopleAdmin, _super);

    function ViewPeopleAdmin() {
      ViewPeopleAdmin.__super__.constructor.call(this);
    }

    ViewPeopleAdmin.prototype.render = function() {
      var divForm, form, mainWrapper, viewWrapper;
      ViewPeopleAdmin.__super__.render.call(this, arguments);
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      viewWrapper = document.createElement('div');
      viewWrapper.className = "view-wraper";
      viewWrapper.innerTHTML = "People Admin View";
      divForm = document.createElement('div');
      divForm.innerHTML = "<br/><br/><br/><br/>ComponentFormAddUser...<br><br>";
      viewWrapper.appendChild(divForm);
      form = new ComponentFormAddUser();
      form.renderdivForm;
      mainWrapper.appendChild(viewWrapper);
    };

    return ViewPeopleAdmin;

  })(ViewBase);

  module.exports = ViewPeopleAdmin;

}).call(this);
