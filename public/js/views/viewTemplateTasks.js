(function() {
  var ComponentTemplateListFactory, ViewBase, ViewTemplateTasks,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewBase = require('./viewBase');

  ComponentTemplateListFactory = require('../components/templateList/componentTemplateListFactory');

  ViewTemplateTasks = (function(_super) {
    __extends(ViewTemplateTasks, _super);

    function ViewTemplateTasks() {
      ViewTemplateTasks.__super__.constructor.call(this);
    }

    ViewTemplateTasks.prototype.render = function() {
      var componentTemplateList, mainWrapper, tableDiv, viewWrapper;
      ViewTemplateTasks.__super__.render.call(this, arguments);
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      viewWrapper = document.createElement('div');
      viewWrapper.className = "view-wraper";
      viewWrapper.innerHTML = "Implicit Tasks View";
      viewWrapper.appendChild(document.createElement('br'));
      tableDiv = document.createElement('div');
      tableDiv.innerHTML = "Table of template tasks";
      componentTemplateList = new ComponentTemplateListFactory.createAll();
      componentTemplateList.render(tableDiv);
      viewWrapper.appendChild(tableDiv);
      viewWrapper.appendChild(document.createElement('br'));
      mainWrapper.appendChild(viewWrapper);
    };

    return ViewTemplateTasks;

  })(ViewBase);

  module.exports = ViewTemplateTasks;

}).call(this);
