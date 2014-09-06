var ComponentTemplateList = require('./componentTemplateList');
var Model = require('../../models/model');
var hrtool = require('../../models/actions');
var ComponentTemplateListFactory = module.exports = {
    createAll: function() {
        var componentTemplateList = new ComponentTemplateList();
        componentTemplateList.setModel(new Model(ComponentTemplateList.EventType.DATA_LOAD),ComponentTemplateList.EventType.DATA_LOAD);
        hrtool.actions.getTemplatesData(componentTemplateList.model);
        return componentTemplateList;
    }
};