var ComponentBase = require('../componentBase');
var ComponentDropdown = require('./componentDropdown');
var helper = require('../../helpers/helpers');

var ComponentFilter  =  module.exports =  function(data, keys) {
    ComponentBase.prototype.constructor.call(this);
    this.super = ComponentBase;

    this._keys = keys;
    this._status = [];
    this._data = data;
    this._dropdowns = [];
    var initData;
    var newDropdown;
    for(var i = 0; i < data.length; i++) {
        initData = this._initData(i);
        newDropdown = new ComponentDropdown(initData);

        this._dropdowns.push(newDropdown);
        this._status.push(newDropdown.selected);

        this.listen(ComponentDropdown.EventType.CHANGE, newDropdown, this._filterData);
    }
};

ComponentFilter.prototype = new ComponentBase();
ComponentFilter.constructor = ComponentFilter;

ComponentFilter.prototype._initData = function(i) {
    var data = this._data[i];
    var selection = this._getSelection(i);

    if(data[selection]) {
        return data[selection];
    }

    var keys = Object.keys(data);
    var key = keys.length > 0 ? keys[0] : '';

    var keyLength = key.split('-').length;
    keyLength = keyLength === 1 && key.length === 0 ? 0 : keyLength;
    var global = '';

    for(var i = 0; i < keyLength; i++) {
        global += 'global-';
    }

    if(global.length > 0)
        global = global.substring(0, global.length - 1);

    var items = data[global] || ComponentDropdown.EmptyOption;
    return items;
};

ComponentFilter.prototype.getStatus = function () {
    if(!this._keys)
        return this._status;
    var res = {};
    for(var i = 0; i < this._keys.length; i++){
        res[this._keys[i]] = this._status[i];
    }
    return res;
};

ComponentFilter.prototype._filterData = function(selected, src) {
    for(var i = 0; i < this._dropdowns.length; i++) {
        var dropdown = this._dropdowns[i];
        var data;
        var selection;
        if(src < dropdown.componentId ) {
            selection = this._getSelection(i);
            data  = this._data[i][selection];
            data = data ? data : ComponentDropdown.EmptyOption;
            dropdown.changeData(data);
            dropdown.setSelection(ComponentDropdown.EmptyOption);
            this._status[i] = dropdown.selected;
            dropdown.setEnabled(data !== ComponentDropdown.EmptyOption);
        } else if(src === dropdown.componentId) {
            this._status[i] = selected;
        }
    }
    this.fire(ComponentFilter.EventType.UPDATED, this.getStatus());
};

ComponentFilter.prototype._getSelection = function(depth) {
    var selection = '';
    var randomKey = Object.keys(this._data[depth])[0];
    var length = randomKey === '' ? 0 : randomKey.split("-").length;
    var oneSelected;
    for(var i = 0; i < length; i++) {
        oneSelected = helper.obj.getData(this._dropdowns[i], ['selected', 'id']);
        selection += oneSelected === -1 ? 'global' : oneSelected;
        selection += '-';
    }

    if(selection.length > 0)
        selection = selection.substring(0, selection.length - 1);

    return selection;
};

ComponentFilter.prototype.createDom = function() {
    var mainDiv = document.createElement('div');
    mainDiv.class = "filtrable-task";

    for(var i = 0; i < this._dropdowns.length; i++) {
        this.addChild('dropdown' + this._dropdowns[i].componentId, this._dropdowns[i], {'el': mainDiv});
    }

    this.element = mainDiv;
};

ComponentFilter.prototype.unselectAll = function() {
    var firstDropdown = this._dropdowns[0];
    firstDropdown.setSelection(ComponentDropdown.EmptyOption);
    this._filterData(ComponentDropdown.EmptyOption, firstDropdown.componentId);
};

ComponentFilter.EventType = {
    UPDATED: 'new_selection'
};
