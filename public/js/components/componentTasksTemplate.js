var ComponentTasksTemplate = function() {
    ComponentBase.prototype.constructor.call(this);
    this.super = ComponentBase;
    this._visible = false;
    this._componentFilter = null;
    this.model = new Model(ComponentTasksTemplate.EventType.GET_DATA);
    this.listen(ComponentTasksTemplate.EventType.GET_DATA, this.model, this.onLoad);
    hrtool.actions.getTemplatesData(this.model);
};

ComponentTasksTemplate.prototype = new ComponentBase();
ComponentTasksTemplate.constructor = ComponentTasksTemplate;



ComponentTasksTemplate.prototype.onLoad = function(templates){
    var departments = this.helper.bulk.getData(['departments']);
    var teams = this.helper.bulk.getData(['teams']);
    /*var data = ComponentFilterFormater.Factory.formatForTripleDropdown(departments, teams, templates,
        {idKey: 'id_department', valueKey: 'title'},
        {idKey: 'id_team', valueKey: 'title', drop1DependencyKey: 'id_department'},
        {idKey: 'id_task_template', valueKey: 'title', drop1DependencyKey: 'id_department', drop2DependencyKey: 'id_team'}
    );*/
    var data = ComponentFilterFormater.Factory.format([
        ComponentFilterFormater.Factory.transform(departments, 'id_department', 'title'),
        ComponentFilterFormater.Factory.transform(teams, 'id_team', 'title', ['id_department']),
        ComponentFilterFormater.Factory.transform(templates, 'id_task_template', 'title', ['id_department', 'id_team'])
    ]);
    this._componentFilter = new ComponentFilter(data);
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