(function() {
  var ComponentTemplateListFactory, ViewBase, ViewTemplates,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewBase = require('./viewBase');

  ComponentTemplateListFactory = require('../components/templateList/componentTemplateListFactory');

  ViewTemplates = (function(_super) {
    __extends(ViewTemplates, _super);

    function ViewTemplates() {
      ViewTemplates.__super__.constructor.call(this);
    }

    ViewTemplates.prototype.render = function() {
      var componentTemplateList, mainWrapper, tableDiv, viewWrapper;
      ViewTemplates.__super__.render.call(this);
      mainWrapper = document.getElementById(ViewBase.mainWrapper);
      viewWrapper = document.createElement('div');
      viewWrapper.className = "view-wraper";
      viewWrapper.innerHTML = "Implicit Tasks View";
      viewWrapper.appendChild(document.createElement('br'));
      tableDiv = document.createElement('div');
      tableDiv.innerHTML = "Table of template tasks";
      componentTemplateList = ComponentTemplateListFactory.createAll();
      componentTemplateList.render(tableDiv);
      viewWrapper.appendChild(tableDiv);
      viewWrapper.appendChild(document.createElement('br'));
      mainWrapper.appendChild(viewWrapper);
    };

    return ViewTemplates;

  })(ViewBase);

  module.exports = ViewTemplates;

}).call(this);
