var ComponentBase = require('../../../componentBase');
var ComponentFilterFormatter = require('../../componentFilterFormatter');
var ComponentFilter = require('../../componentFilter');
var hrtool = require('../../../../models/actions');
var Model = require('../../../../models/model');

var ComponentTasksTemplate = function() {
    ComponentBase.prototype.constructor.call(this);
    this.super = ComponentBase;
    this.setModel(new Model(ComponentTasksTemplate.EventType.GET_DATA), ComponentTasksTemplate.EventType.GET_DATA);
    hrtool.actions.getTemplatesData(this.model);
};

ComponentTasksTemplate.prototype = Object.create(ComponentBase.prototype);
ComponentTasksTemplate.constructor = ComponentTasksTemplate;



ComponentTasksTemplate.prototype.onLoad = function(templates){
    this._templates = templates;
    var departments = this.helper.bulk.getData(['departments']);
    var teams = this.helper.bulk.getData(['teams']);
    var data = ComponentFilterFormatter.factory.createTemplateDropdowns(departments, teams, templates);

    this._componentFilter = new ComponentFilter(data, ['department', 'team', 'task_template']);
    this.addChild('componentFilter', this._componentFilter, {el: this.element});
    this._componentFilter.render(this.element);
};



/**
 * Creates component's DOM. Inserts html elements into one <div>
 */
ComponentTasksTemplate.prototype.createDom = function() {
    this.element = document.createElement('div');
    this.element.className = ComponentTasksTemplate.WRAPPER_CLASS;

    var headline = document.createElement('span');
    headline.className = ComponentTasksTemplate.HEADLINE_CLASS;
    headline.innerHTML = 'Choose saved task';
    this.element.appendChild(headline);

};


ComponentTasksTemplate.prototype.getSelectedTemplate = function(id){
    for(var i = 0; i < this._templates.length; i++){
        if(this._templates[i].id_task_template === id){
            return this._templates[i];
        }
    }
};



ComponentTasksTemplate.prototype.getStatus = function(){
    return this._componentFilter.getStatus();
};



ComponentTasksTemplate.WRAPPER_CLASS = 'task-template-div';
ComponentTasksTemplate.HEADLINE_CLASS = 'task-template-headline';
ComponentTasksTemplate.EventType = {GET_DATA: 'template/get-all'};

module.exports = ComponentTasksTemplate;