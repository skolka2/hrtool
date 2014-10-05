var ComponentBase = require('../componentBase');
var helper = require('../../helpers/helpers');
var Const = require('../../helpers/constants');
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
var ComponentDropdown = module.exports = function(data, useSearch) {
    ComponentBase.prototype.constructor.call(this);
    this.super = ComponentBase;
    this.selected = "";
    this._enabled = true;

    this.useSearch = false;
    this.searchEl = null;

    if(useSearch != null || data.length >= ComponentDropdown.SEARCH_FROM_ITEMS_COUNT) {
        this.useSearch = useSearch;
    }

    this._map = [];

    this._selectedTextElement = document.createElement('div');
    this._selectedTextElement.id = 'component-' + this.componentId + 'dropdown-button';
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
    CHANGE: 'dropdown-change'
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
        this._selectedTextElement.classList.remove(ComponentBase.INVALID_INPUT_CLASS);
        if (this._listEl.style.visibility === 'visible') {
            this._listEl.style.visibility = 'hidden';
            if(this.useSearch) {
                this.searchEl.value = "";
                this.handleSearch();
            }
            return;
        }

        /*Close list on click in body (outside of span)*/
        this._listEl.style.visibility = 'visible';

        if(this.useSearch) {
            this.searchEl.focus();
        }

        var onClick;
        onClick = function (ev) {
            if (this.getElement() === ev.target || this.getElement().contains(ev.target)) {
                this._makeSelection(ev, onClick);
            }
            else {
                this._listEl.style.visibility = 'hidden';
                if(this.useSearch) {
                    this.searchEl.value = "";
                    this.handleSearch();
                }
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

    if(this.useSearch) {
        var userInput = document.createElement('input');
        userInput.setAttribute("type","text");
        userInput.placeholder = "Search:";
        userInput.className = "dropDownItem userInput";

        this._listEl.appendChild(userInput);
        this.searchEl = userInput;
        this.searchEl.addEventListener("keyup", this.handleSearch.bind(this));
    }

    if(data === ComponentDropdown.EmptyOption)
        this.setEnabled(false);
    var li = document.createElement('li');
    li.className = 'dropDownItem deselector';
    li.innerHTML = "Clear...";
    var empty = ComponentDropdown.EmptyOption;
    this._map.push({
        el: li,
        value: empty,
        searchValue: empty.value
    });

    var text = document.createTextNode("");
    li.appendChild(text);

    this._listEl.appendChild(li);
    this.setSelection(empty);
    var div = document.createElement('div');
    div.className = 'dropdown-item-wrapper';

    for(var i = 0; i < data.length; i++) {
        var li = document.createElement('li');
        li.className = 'dropDownItem';
        this._map.push({
            el: li,
            value: data[i],
            searchValue: helper.format.getUniversalString(data[i].value).toLowerCase().replace(/\s/g, "")
        });

        var text = document.createTextNode(data[i].value);
        li.appendChild(text);

        //this._listEl.appendChild(li);
        div.appendChild(li);

        if(data[i].selected) {
            this.setSelection(data[i]);
        }
    }

    this._listEl.appendChild(div);
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
    this.fire(ComponentDropdown.EventType.CHANGE, this.selected);
};

/**
 * Verifies correct form of data object and if it's OK, calls the function
 * filling list with data.
 * @param {object} data Object containing data with keys 'selected' and 'items',
 * where items is an object or array with items to be shown as options.
 * @returns {undefined}
 */
ComponentDropdown.prototype.changeData = function (data) {
    this._listEl.innerHTML = "";
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
    this.element.id = 'component-' + this.componentId;
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

/**
 * Function that handles search after changing input from user
 */ 
ComponentDropdown.prototype.handleSearch = function() {
    for(var i = 0; i < this._map.length; i++) {
        var stringFromMap = this._map[i].searchValue;
        var stringFromInput = helper.format.getUniversalString(this.searchEl.value).toLowerCase().replace(/\s/g, "");

        if(stringFromMap.indexOf(stringFromInput) == -1) {
            this._map[i].el.style.display = "none";
        }
        else {
            this._map[i].el.style.display = "list-item";
        }
    }
};

ComponentDropdown.EmptyOption = {
    value: "",
    id: -1
};

ComponentDropdown.SEARCH_FROM_ITEMS_COUNT = 10;