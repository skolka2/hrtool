var ComponentBase = require('../componentBase');

var ComponentTabbedArea = function(tabNames, components) {
    ComponentBase.prototype.constructor.call(this);
    this.super = ComponentBase;
    this._currentTab = 0;

    this._tabs = [];
    this._divs = [];
    this._tabNames = tabNames;

    var name;
    for(var i = 0; i < components.length; i++) {
        this._divs.push(document.createElement('div'));
        this._divs[i].className = ComponentTabbedArea.UNSELECTED_TAB_DIV_CLASS;
        for (var j = 0; j < components[i].length; j++) {
            name = 'tabbedArea-' + tabNames[i] + '-component-' + j;
            this.addChild(name, components[i][j], {el: this._divs[i]});
        }
    }
    this._divs[0].className = ComponentTabbedArea.SELECTED_TAB_DIV_CLASS;
};

ComponentTabbedArea.prototype = Object.create(ComponentBase.prototype);
ComponentTabbedArea.constructor = ComponentTabbedArea;



ComponentTabbedArea.prototype.createDom = function(){
    this.element = document.createElement('div');
    var divWrapper = document.createElement('div');
    var ul = document.createElement('ul');

    this.element.className = ComponentTabbedArea.WRAPPER_CLASS;
    divWrapper.className = ComponentTabbedArea.DIVS_WRAPPER_CLASS;
    ul.className = ComponentTabbedArea.TABS_CLASS;

    var li, a, name;
    for(var i = 0; i < this._tabNames.length; i++){
        li = document.createElement('li');

        a = document.createElement('a');
        a.className = (i == this._currentTab) ? ComponentTabbedArea.SELECTED_TAB_CLASS : ComponentTabbedArea.UNSELECTED_TAB_CLASS;
        a.div_index = i;
        name = document.createTextNode(this._tabNames[i]);
        this._tabs.push(a);

        a.appendChild(name);
        li.appendChild(a);
        ul.appendChild(li);

        divWrapper.appendChild(this._divs[i]);
    }
    this.element.appendChild(ul);
    this.element.appendChild(divWrapper);
    this.element.addEventListener('click', this.handleClickEvent.bind(this), false);
};




ComponentTabbedArea.prototype.handleClickEvent = function(e){
    if(e.srcElement.div_index !== undefined) {
        this._divs[this._currentTab].className = ComponentTabbedArea.UNSELECTED_TAB_DIV_CLASS;
        this._tabs[this._currentTab].className = ComponentTabbedArea.UNSELECTED_TAB_CLASS;
        this._currentTab = e.srcElement.div_index;
        this._divs[this._currentTab].className = ComponentTabbedArea.SELECTED_TAB_DIV_CLASS;
        this._tabs[this._currentTab].className = ComponentTabbedArea.SELECTED_TAB_CLASS;
    }
};


ComponentTabbedArea.prototype.getSelectedTabNumber = function(){
    return this._currentTab;
};









ComponentTabbedArea.WRAPPER_CLASS = 'tabbed-area';
ComponentTabbedArea.DIVS_WRAPPER_CLASS = 'box-wrap';
ComponentTabbedArea.TABS_CLASS = 'tabs';
ComponentTabbedArea.SELECTED_TAB_CLASS = 'tab-selected';
ComponentTabbedArea.UNSELECTED_TAB_CLASS = 'tab-unselected';
ComponentTabbedArea.SELECTED_TAB_DIV_CLASS = 'tab-div-selected';
ComponentTabbedArea.UNSELECTED_TAB_DIV_CLASS = 'tab-div-unselected';

module.exports = ComponentTabbedArea;