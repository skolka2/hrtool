var ComponentBase = require('../../componentBase');
var ComponentFilterFormatter = require('../componentFilterFormatter');
var ComponentFilter = require('../componentFilter');
var hrtool = require('../../../models/actions');
var Model = require('../../../models/model');

var ComponentTasksTemplate = function() {
    ComponentBase.prototype.constructor.call(this);
    this.super = ComponentBase;
    this._visible = false;
    this._componentFilter = null;
    this.setModel(new Model(ComponentTasksTemplate.EventType.GET_DATA), ComponentTasksTemplate.EventType.GET_DATA);
    hrtool.actions.getTemplatesData(this.model);
};

ComponentTasksTemplate.prototype = new ComponentBase();
ComponentTasksTemplate.constructor = ComponentTasksTemplate;



ComponentTasksTemplate.prototype.onLoad = function(templates){
    var departments = this.helper.bulk.getData(['departments']);
    var teams = this.helper.bulk.getData(['teams']);
    var data = ComponentFilterFormatter.factory.createTemplateDropdowns(departments, teams, templates);

    this._componentFilter = new ComponentFilter(data, ['department', 'team', 'template']);
    this._componentFilter.render(this.element);
    this.addChild('componentFilter', this._componentFilter, {el: this.element});
};



/**
 * Creates component's DOM. Inserts html elements into one <div>
 */
ComponentTasksTemplate.prototype.createDom = function() {
    this.element = document.createElement('div');
    this.element.className = ComponentTasksTemplate.DIV_CLASS;

    var headline = document.createElement('span');
    headline.className = ComponentTasksTemplate.HEADLINE_CLASS;
    headline.innerHTML = 'Choose saved task';
    this.element.appendChild(headline);
};


/**
 * State of component getter
 * @returns {boolean} - true if component is visible, false otherwise
 */
ComponentTasksTemplate.prototype.isVisible = function(){
    return this._visible;
};

/**
 * Set actual state of this component
 * @param visible - true/false
 */
ComponentTasksTemplate.prototype.setVisible = function(visible){
    this._visible = visible;
};

ComponentTasksTemplate.DIV_CLASS = 'task-template-div';
ComponentTasksTemplate.HEADLINE_CLASS = 'task-template-headline';
ComponentTasksTemplate.EventType = {GET_DATA: 'template/get-all'};

module.exports = ComponentTasksTemplate;