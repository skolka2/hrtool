(function() {
  var ComponentTemplateList, ComponentTemplateListFactory, Model, hrtool;

  ComponentTemplateList = require('./componentTemplateList');

  Model = require('../../models/model');

  hrtool = require('../../models/actions');

  ComponentTemplateListFactory = {
    createAll: function() {
      var componentTemplateList;
      componentTemplateList = new ComponentTemplateList();
      componentTemplateList.setModel(new Model(ComponentTemplateList.eventType.DATA_LOAD), ComponentTemplateList.eventType.DATA_LOAD);
      hrtool.actions.getTemplatesData(componentTemplateList.model);
      return componentTemplateList;
    }
  };

  module.exports = ComponentTemplateListFactory;

}).call(this);
