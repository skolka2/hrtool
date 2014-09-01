var ComponentFiltrableTask = function(data) {
    ComponentBase.prototype.constructor.call(this);
    this.super = ComponentBase;

    this._status = [];
    this._data = data;
    this._dropdowns = [];
    this._empty = [{value: "", id: -1}];

    for(var i = 0; i < data.length; i++) {
        var initData = this._initData(i);
        var newDropdown = new ComponentDropdown(initData);

        if(initData === this._empty)
            newDropdown.setEnabled(false);
        this._dropdowns.push(newDropdown);
        this._status.push(newDropdown.selected);

        this.listen(ComponentDropdown.EventType.CHANGE, newDropdown, this._filterData);
    }
};

ComponentFiltrableTask.prototype = new ComponentBase();
ComponentFiltrableTask.constructor = ComponentFiltrableTask;

ComponentFiltrableTask.prototype._initData = function(i) {
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

    var items = data[global] !== undefined ? data[global] : this._empty;
    return items;
};

ComponentFiltrableTask.prototype.getStatus = function () {
    return this._status;
};

ComponentFiltrableTask.prototype._filterData = function(selected, src) {
    for(var i = 0; i < this._dropdowns.length; i++) {
        var dropdown = this._dropdowns[i];
        if(src < dropdown.componentId ) {
            var selection = this._getSelection(i);
            var data = this._data[i][selection];
            data = data ? data : this._empty;
            dropdown.changeData(data);
            dropdown.setSelection(this._empty[0]);
            this._status[i] = dropdown.selected;
            dropdown.setEnabled(data !== this._empty);
        } else if(src === dropdown.componentId) {
            this._status[i] = selected;
        }
    }

    this.fire(ComponentFiltrableTask.EventType.UPDATED, this.getStatus());
};

ComponentFiltrableTask.prototype._getSelection = function(depth) {
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

ComponentFiltrableTask.prototype.createDom = function() {
    var mainDiv = this.helper.dom.createElement('<div class="filtrable-task"></div>');

    for(var i = 0; i < this._dropdowns.length; i++) {
        this.addChild('dropdown' + this._dropdowns[i].componentId, this._dropdowns[i], mainDiv);
    }

    this.element = mainDiv;
};

ComponentFiltrableTask.EventType = {
    UPDATED: 'new_selection'
};
