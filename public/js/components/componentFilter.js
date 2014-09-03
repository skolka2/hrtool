var ComponentFilter = function(data) {
    ComponentBase.prototype.constructor.call(this);
    this.super = ComponentBase;

    this._status = [];
    this._data = data;
    this._dropdowns = [];

    for(var i = 0; i < data.length; i++) {
        var initData = this._initData(i);
        var newDropdown = new ComponentDropdown(initData);

        this._dropdowns.push(newDropdown);
        this._status.push(newDropdown.selected);

        this.listen(ComponentDropdown.EventType.CHANGE, newDropdown, this._filterData);
    }
};

ComponentFilter.prototype = new ComponentBase();
ComponentFilter.constructor = ComponentFilter;

ComponentFilter.prototype._initData = function(i) {
    var data = this._data[i];
    var keys = Object.keys(data);
    var key = keys.length > 0 ? keys[0] : '';

    var keyLength = key.split('-').length;
    keyLength = keyLength === 1 ? 0 : keyLength;
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
    return this._status;
};

ComponentFilter.prototype._filterData = function(selected, src) {
    for(var i = 0; i < this._dropdowns.length; i++) {
        var dropdown = this._dropdowns[i];
        if(src < dropdown.componentId ) {
            var selection = this._getSelection(i);
            var data = this._data[i][selection];
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
    for(var i = 0; i < depth; i++) {
        var oneSelected = this._dropdowns[i].selected.id;
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

ComponentFilter.EventType = {
    UPDATED: 'new_selection'
};
