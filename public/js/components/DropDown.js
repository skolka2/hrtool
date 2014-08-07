/**
 * DropDown class: creates clickable span contaning selected item and
 * a list (ul - with visibility set on 'hidden' by default) of selectable items.
 * The list is shown when the span is clicked. After that it can be hidden by
 * clicking on an item of the list (this item is accessible in this.selected
 * now) or by clicking anywhere else in the body (this.selected remains
 * unchanged).
 * @param {object} data 
 * @returns {DropDown}
 */
var DropDown = function(data) {
    this.super = ComponentBase;
    this.super.call(this);
    this.selected = "";
    
    this.__selectedTextElement = document.createElement('span');
    this.__list = document.createElement('ul');
    this.__list.className = 'dropDownButton';
    this.__list.id = 'dropDownList_' + this.componentId;
    this.__selectedTextElement.addEventListener('click', this.__openList.bind(this), false);
    this.changeData(data);
};


DropDown.prototype = new ComponentBase();
DropDown.prototype.constructor = DropDown;

/**
 * Shows the list of items provided in data object
 * @returns {undefined}
 */
DropDown.prototype.__openList = function () {
    /*Close list on click in body (outside of span)*/
    document.body.addEventListener('click', function(res) {
        if(res.srcElement !== this.__selectedTextElement) {
            this.__list.style.visibility = 'hidden';
            document.body.removeEventListener('click');
        }
    }.bind(this), false);
    this.__list.style.visibility = 'visible';
    console.log('visible');
    
};

/**
 * 
 * @param {object} data Object containing data with keys 'selected' and 'items',
 * where items is an object or array with items to be shown as options.
 * @returns {undefined}
 */
DropDown.prototype.__fillWithData = function(data) {
    if(data.selected) {
        this.selected = data.selected;
    }
    
    this.__list.style.visibility = 'hidden';
    for(var item in data.items) {
        var li = document.createElement('li');
        li.className = 'dropDownItem';
        li.addEventListener('click', this.__makeSelection.bind(this), false);
        
        var text = document.createTextNode(data.items[item]);
        
        li.appendChild(text);
        this.__list.appendChild(li);
    };
};

/**
 * Verifies correct form of data object and if it's OK, calls the function
 * filling list with data.
 * @param {object} data Object containing data with keys 'selected' and 'items',
 * where items is an object or array with items to be shown as options.
 * @returns {undefined}
 */
DropDown.prototype.changeData = function (data) {
    if(data !== undefined && data.items)
        this.__fillWithData(data);
};

/**
 * When an option is clicked, this function changes selected item
 * @param {type} src
 * @returns {undefined}
 */
DropDown.prototype.__makeSelection = function (src) {
    this.selected = src.target.textContent;
    this.__selectedTextElement.innerText = this.selected;
    document.body.removeEventListener('click');
    this.__list.style.visibility = 'hidden';
    
    //this.notify(TYPE, this.selected, this.componentId); //TODO co se vlastne emituje za udalost?
};

/**
 * Creates component's DOM. Inserts html elements into one <div>
 * @returns {undefined}
 */
DropDown.prototype.createDom = function() {
    this.super.prototype.createDom.apply(this);
    
    this.element.className = 'dropDownDiv';
    this.element.id = 'dropDownDiv_' + this.componentId;
    
    this.element.appendChild(this.__selectedTextElement);
    this.element.appendChild(this.__list);
};


