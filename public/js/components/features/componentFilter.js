(function() {
  var ComponentBase, ComponentDropdown, ComponentFilter, helper,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../componentBase');

  ComponentDropdown = require('./componentDropdown');

  helper = require('../../helpers/helpers');

  ComponentFilter = (function(_super) {
    __extends(ComponentFilter, _super);

    function ComponentFilter(_data, _keys, searchable) {
      var i, newDropdown, _i, _ref;
      this._data = _data;
      this._keys = _keys;
      ComponentFilter.__super__.constructor.call(this);
      this._status = [];
      this._dropdowns = [];
      searchable = searchable ? searchable : searchable = Array.apply(null, new Array(this._data.length)).map(Boolean.prototype.valueOf, false);
      for (i = _i = 0, _ref = this._data.length; _i < _ref; i = _i += 1) {
        newDropdown = new ComponentDropdown(this._initData(i), searchable[i]);
        this._dropdowns.push(newDropdown);
        this._status.push(newDropdown.selected);
        this.listen(ComponentDropdown.EventType.CHANGE, newDropdown, this._filterData);
      }
    }

    ComponentFilter.prototype._initData = function(i) {
      var data, global, items, key, keyLength, keys, selection, _i;
      data = this._data[i];
      selection = this._getSelection(i);
      if (data[selection]) {
        return data[selection];
      }
      keys = Object.keys(data);
      key = keys.length > 0 ? keys[0] : '';
      keyLength = key.split('-').length;
      keyLength = keyLength === 1 && key.length === 0 ? 0 : keyLength;
      global = '';
      for (i = _i = 0; _i < keyLength; i = _i += 1) {
        global += 'global-';
      }
      if (global.length > 0) {
        global = global.substring(0, global.length - 1);
      }
      items = data[global] || ComponentDropdown.EmptyOption;
      return items;
    };

    ComponentFilter.prototype.getStatus = function() {
      var i, item, res, _i, _len, _ref;
      if (!this._keys) {
        return this._status;
      }
      res = {};
      _ref = this._keys;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        item = _ref[i];
        res[item] = this._status[i];
      }
      return res;
    };

    ComponentFilter.prototype._filterData = function(selected, src) {
      var alreadyLoaded, data, dropdown, i, selection, _i, _len, _ref;
      _ref = this._dropdowns;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        dropdown = _ref[i];
        if (src < dropdown.componentId) {
          selection = this._getSelection(i);
          data = this._data[i][selection];
          data = data ? data : ComponentDropdown.EmptyOption;
          alreadyLoaded = data !== ComponentDropdown.EmptyOption && data.filter(function(item) {
            return item === dropdown.selected;
          }).length > 0;
          if (!alreadyLoaded) {
            dropdown.changeData(data);
            dropdown.setSelection(ComponentDropdown.EmptyOption);
          }
          this._status[i] = dropdown.selected;
          dropdown.setEnabled(data !== ComponentDropdown.EmptyOption);
        } else if (src === dropdown.componentId) {
          if (this._status[i] === selected) {
            return;
          }
          this._status[i] = selected;
        }
      }
      this.fire(ComponentFilter.EventType.UPDATED, this.getStatus());
    };

    ComponentFilter.prototype._getSelection = function(depth) {
      var i, length, oneSelected, randomKey, selection, _i;
      selection = '';
      randomKey = Object.keys(this._data[depth])[0];
      if (randomKey) {
        length = randomKey === '' ? 0 : randomKey.split("-").length;
        for (i = _i = 0; _i < length; i = _i += 1) {
          oneSelected = helper.obj.getData(this._dropdowns[i], ['selected', 'id']);
          selection += oneSelected === -1 ? 'global' : oneSelected;
          selection += '-';
        }
        if (selection.length > 0) {
          selection = selection.substring(0, selection.length - 1);
        }
      }
      return selection;
    };

    ComponentFilter.prototype.createDom = function() {
      var dropdown, mainDiv, _i, _len, _ref;
      mainDiv = document.createElement('div');
      mainDiv["class"] = "filtrable-task";
      _ref = this._dropdowns;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dropdown = _ref[_i];
        this.addChild('dropdown' + dropdown.componentId, dropdown, {
          'el': mainDiv
        });
      }
      this.element = mainDiv;
    };

    ComponentFilter.prototype.unselectAll = function() {
      var firstDropdown;
      firstDropdown = this._dropdowns[0];
      firstDropdown.setSelection(ComponentDropdown.EmptyOption);
      this._filterData(ComponentDropdown.EmptyOption, firstDropdown.componentId);
    };

    ComponentFilter.prototype.setActive = function(active) {
      var dropdown, _i, _len, _ref;
      _ref = this._dropdowns;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dropdown = _ref[_i];
        dropdown.setEnabled(active);
      }
    };

    return ComponentFilter;

  })(ComponentBase);

  ComponentFilter.EventType = {
    UPDATED: 'new_selection'
  };

  module.exports = ComponentFilter;

}).call(this);
