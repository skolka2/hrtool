var ComponentBase = require('../../../componentBase');
var ComponentFilterFormatter = require('../../componentFilterFormatter');
var ComponentFilter = require('../../componentFilter');
var hrtool = require('../../../../models/actions');
var Model = require('../../../../models/model');

var ComponentRight = function() {
    ComponentBase.prototype.constructor.call(this);
    this.super = ComponentBase;
    this.setModel(new Model(ComponentRight.EventType.GET_DATA), ComponentRight.EventType.GET_DATA);
    hrtool.actions.getTemplatesData(this.model);
};

ComponentRight.prototype = Object.create(ComponentBase.prototype);
ComponentRight.constructor = ComponentRight;



ComponentRight.prototype.onLoad = function(templates){
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
ComponentRight.prototype.createDom = function() {
    this.element = document.createElement('div');
    this.element.className = ComponentRight.WRAPPER_CLASS;

    var headline = document.createElement('span');
    headline.className = ComponentRight.HEADLINE_CLASS;
    headline.innerHTML = 'Choose saved task';
    this.element.appendChild(headline);

};


ComponentRight.prototype.getSelectedTemplate = function(id){
    for(var i = 0; i < this._templates.length; i++){
        if(this._templates[i].id_task_template === id){
            return this._templates[i];
        }
    }
};



ComponentRight.prototype.getStatus = function(){
    return this._componentFilter.getStatus();
};



ComponentRight.WRAPPER_CLASS = 'task-template-div';
ComponentRight.HEADLINE_CLASS = 'task-template-headline';
ComponentRight.EventType = {
    GET_DATA: 'template/get-all'
};

module.exports = ComponentRight;