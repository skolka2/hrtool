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
    ComponentBase.prototype.constructor.call(this);
    this.super = ComponentBase;
    this.selected = "";
    this._enabled = true;

    this._map = [];

    this._selectedTextElement = document.createElement('div');
    this._selectedTextElement.className = 'dropdown-button ' + ComponentDropdown.State.ENABLED;

    this._listEl = document.createElement('ul');
    this._listEl.className = 'dropDownButton';
    this._listEl.style.visibility = 'hidden';

    this._selectedTextElement.addEventListener(ComponentBase.EventType.CLICK, this._handleListOpen.bind(this), false);
    this.changeData(data);
};


ComponentDropdown.prototype = new ComponentBase();
ComponentDropdown.prototype.constructor = ComponentDropdown;

ComponentDropdown.EventType = {
    CHANGE: 'change'
};

ComponentDropdown.State = {
    ENABLED: 'dropdown',
    DISABLED: 'dropdown disabled'
};

/**
 * Shows the list of items provided in data object
 * @returns {undefined}
 */
ComponentDropdown.prototype._handleListOpen = function () {
    if(this._enabled) {
        if (this._listEl.style.visibility === 'visible') {
            this._listEl.style.visibility = 'hidden';
            return;
        }

        /*Close list on click in body (outside of span)*/
        this._listEl.style.visibility = 'visible';
        var onClick;
        onClick = function (ev) {
            if (this.getElement() === ev.target || this.getElement().contains(ev.target)) {
                this._makeSelection(ev, onClick);
            }
            else {
                this._listEl.style.visibility = 'hidden';
                document.body.removeEventListener(ComponentBase.EventType.CLICK, onClick, false);
            }
        }.bind(this);

        document.body.addEventListener(ComponentBase.EventType.CLICK, onClick, false);
    }
};

/**
 *
 * @param {object} data Object containing data with keys 'selected' and 'items',
 * where items is an object or array with items to be shown as options.
 * @returns {undefined}
 */
ComponentDropdown.prototype._fillWithData = function(data) {
    this._map = [];

    if(data === ComponentDropdown.EmptyOption)
        this.setEnabled(false);
    var li = document.createElement('li');
    li.className = 'dropDownItem deselector';
    li.innerHTML = "Clear...";
    var empty = ComponentDropdown.EmptyOption;
    this._map.push({
        el: li,
        value: empty
    });

    var text = document.createTextNode("");
    li.appendChild(text);

    this._listEl.appendChild(li);
    this.setSelection(empty);

    for(var i = 0; i < data.length; i++) {
        var li = document.createElement('li');
        li.className = 'dropDownItem';
        this._map.push({
            el: li,
            value: data[i]
        });

        var text = document.createTextNode(data[i].value);
        li.appendChild(text);

        this._listEl.appendChild(li);

        if(data[i].selected) {
            this.setSelection(data[i]);
        }
    }
};

/**
 * Sets new label and saves selected item into this.selected
 */
ComponentDropdown.prototype.setSelection = function(selectedItem) {
    this.selected = selectedItem;
    if(selectedItem.value === "") {
        this._selectedTextElement.innerHTML = "Select...";
    }
    else {
        this._selectedTextElement.innerHTML = selectedItem.value;
    }
};

/**
 * Verifies correct form of data object and if it's OK, calls the function
 * filling list with data.
 * @param {object} data Object containing data with keys 'selected' and 'items',
 * where items is an object or array with items to be shown as options.
 * @returns {undefined}
 */
ComponentDropdown.prototype.changeData = function (data) {
    this._listEl.innerText = "";
    this._fillWithData(data);
};
/**
 * When an option is clicked, this function changes selected item
 * @param {element} src source of event ComponentBase.EventType.CLICK
 * @param {function} onClick function to remove from eventListener binded on body
 * @returns {undefined}
 */
ComponentDropdown.prototype._makeSelection = function (src, onClick) {
    var selection = this._map.filter(function(item){
            return item.el === src.target}
    );

    if(selection.length > 0) {
        this.setSelection(selection[0].value);

        this._listEl.style.visibility = 'hidden';
        document.body.removeEventListener(ComponentBase.EventType.CLICK, onClick, false);
        this.fire(ComponentDropdown.EventType.CHANGE, this.selected);
    }
};

/**
 * Creates component's DOM. Inserts html elements into one <div>
 * @returns {undefined}
 */
ComponentDropdown.prototype.createDom = function() {
    this.element = document.createElement("div");
    this.element.className = 'dropDownDiv';

    this.element.appendChild(this._selectedTextElement);
    this.element.appendChild(this._listEl);
};

/**
 * Sets dropdown's property enabled (it is clickable if true)
 * @param enabled true/false - enabled/disabled
 */
ComponentDropdown.prototype.setEnabled = function(enabled) {
    this._enabled = enabled;
    var selection = this._selectedTextElement.classList;
    if (enabled) {
        selection.remove("disabled");
    }
    else {
        selection.add("disabled");
    }
};
/**
 * Returns true if enabled, false otherwise
 * @returns {boolean|*}
 */
ComponentDropdown.prototype.getIsEnabled = function() {
    return this._enabled;
};

ComponentDropdown.EmptyOption = {
    value: "",
    id: -1
};