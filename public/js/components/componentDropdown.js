/**
 * DropDown class: creates clickable span contaning selected item and
 * a list (ul - with visibility set on 'hidden' by default) of selectable items.
 * The list is shown when the span is clicked. After that it can be hidden by
 * clicking on an item of the list (this item is accessible in this.selected
 * now) or by clicking anywhere else in the body (this.selected remains
 * unchanged).
 * @param {object} data 
 * @returns {ComponentDropdown}
 */
var ComponentDropdown = function(data) {
    this.super = ComponentBase;
    this.super.call(this);
    this.selected = "";
    
    this._selectedTextElement = document.createElement('span');

    this._list = document.createElement('ul');
    this._list.className = 'dropDownButton';
    this._list.id = 'dropDownList_' + this.componentId;
    this._list.style.visibility = 'hidden';

    this._selectedTextElement.addEventListener(ComponentBase.EventType.CLICK, this._openList.bind(this), false);
    this.changeData(data);
};


ComponentDropdown.prototype = new ComponentBase();
ComponentDropdown.prototype.constructor = ComponentDropdown;
ComponentDropdown.EventType = ComponentDropdown.EventType || {};
ComponentDropdown.EventType.CHANGE = 'change';

/**
 * Shows the list of items provided in data object
 * @returns {undefined}
 */
ComponentDropdown.prototype._openList = function () {
    if(this._list.style.visibility === 'visible') {
        this._list.style.visibility = 'hidden';
            return;
    }
    /*Close list on click in body (outside of span)*/
    this._list.style.visibility = 'visible';
    var onClick;
    onClick = function (ev) {
        if (ev.target.className === 'dropDownItem') {
            this._makeSelection(ev);
        }
        if(ev.target !== this._list && ev.target !== this._selectedTextElement) {
            this._list.style.visibility = 'hidden';
            document.body.removeEventListener('click', onClick, false);
        }
    }.bind(this);

    document.body.addEventListener(ComponentBase.EventType.CLICK, onClick, false);
};

/**
 * 
 * @param {object} data Object containing data with keys 'selected' and 'items',
 * where items is an object or array with items to be shown as options.
 * @returns {undefined}
 */
ComponentDropdown.prototype._fillWithData = function(data) {
    if(data.selected) {
        this.selected = data.selected;
        this._selectedTextElement.textContent = this.selected;
    }

    for(var item in data.items) {
        var li = document.createElement('li');
        li.className = 'dropDownItem';
        
        var text = document.createTextNode(data.items[item]);
        
        li.appendChild(text);
        this._list.appendChild(li);
    };
};

/**
 * Verifies correct form of data object and if it's OK, calls the function
 * filling list with data.
 * @param {object} data Object containing data with keys 'selected' and 'items',
 * where items is an object or array with items to be shown as options.
 * @returns {undefined}
 */
ComponentDropdown.prototype.changeData = function (data) {
    if(data !== undefined && data.items) {
        var item;
        while(item = this._list.children.item()) {
            this._list.removeChild(item);
        }
        this._fillWithData(data);
    }
};

/**
 * When an option is clicked, this function changes selected item
 * @param {type} src
 * @returns {undefined}
 */
ComponentDropdown.prototype._makeSelection = function (src) {
    this.selected = src.target.textContent;
    this._selectedTextElement.innerHTML = this.selected;
    
    this.fire(ComponentDropdown.EventType.CHANGE, this.selected);
};

/**
 * Creates component's DOM. Inserts html elements into one <div>
 * @returns {undefined}
 */
ComponentDropdown.prototype.createDom = function() {
    this.element = document.createElement("div");
    this.element.className = 'dropDownDiv';
    this.element.id = 'dropDownDiv_' + this.componentId;
    
    this.element.appendChild(this._selectedTextElement);
    this.element.appendChild(this._list);
};
