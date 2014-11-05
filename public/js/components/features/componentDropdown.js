(function() {
  var ComponentBase, ComponentDropdown, Const, helper,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../componentBase');

  helper = require('../../helpers/helpers');

  Const = require('../../helpers/constants');

  ComponentDropdown = (function(_super) {
    __extends(ComponentDropdown, _super);

    function ComponentDropdown(_data, useSearch) {
      this._data = _data;
      this.handleSearch = __bind(this.handleSearch, this);
      this._handleListOpen = __bind(this._handleListOpen, this);
      ComponentDropdown.__super__.constructor.call(this);
      this.selected = '';
      this._enabled = true;
      this.searchEl = null;
      this.useSearch = false;
      this._map = [];
      if (useSearch === null || this._data.length >= ComponentDropdown.SEARCH_FROM_ITEMS_COUNT) {
        this.useSearch = useSearch;
      }
      this._selectedTextElement = document.createElement('div');
      this._selectedTextElement.id = 'component-' + this.componentId + 'dropdown-button';
      this._selectedTextElement.className = 'dropdown-button ' + ComponentDropdown.State.ENABLED;
      this._listEl = document.createElement('ul');
      this._listEl.className = 'dropDownButton';
      this._listEl.style.visibility = 'hidden';
      this._selectedTextElement.addEventListener(ComponentBase.EventType.CLICK, this._handleListOpen, false);
      this.changeData(this._data);
    }

    ComponentDropdown.prototype._handleListOpen = function() {
      var onClick;
      if (this._enabled === true) {
        if (this._listEl.style.visibility === 'visible') {
          this._listEl.style.visibility = 'hidden';
          if (this.useSearch === true) {
            this.searchEl.value = "";
            this.handleSearch();
          }
          return;
        }
        this._listEl.style.visibility = 'visible';
        if (this.useSearch === true) {
          this.searchEl.focus();
        }
        onClick = (function(_this) {
          return function(ev) {
            if (_this.getElement() === ev.target || _this.getElement().contains(ev.target)) {
              return _this._makeSelection(ev, onClick);
            } else {
              _this._listEl.style.visibility = 'hidden';
              if (_this.useSearch === true) {
                _this.searchEl.value = "";
                _this.handleSearch();
              }
              return document.body.removeEventListener(ComponentBase.EventType.CLICK, onClick, false);
            }
          };
        })(this);
        document.body.addEventListener(ComponentBase.EventType.CLICK, onClick, false);
      }
    };

    ComponentDropdown.prototype._fillWithData = function(data) {
      var div, empty, item, li, text, userInput, _i, _len;
      this._map = [];
      if (this.useSearch === true) {
        userInput = document.createElement('input');
        userInput.setAttribute("type", "text");
        userInput.placeholder = "Search:";
        userInput.className = "dropDownItem userInput";
        this._listEl.appendChild(userInput);
        this.searchEl = userInput;
        this.searchEl.addEventListener("keyup", this.handleSearch);
      }
      if (data === ComponentDropdown.EmptyOption) {
        this.setEnabled(false);
      }
      li = document.createElement('li');
      li.className = 'dropDownItem deselector';
      li.innerHTML = "Clear...";
      empty = ComponentDropdown.EmptyOption;
      this._map.push({
        el: li,
        value: empty,
        searchValue: empty.value
      });
      text = document.createTextNode('');
      li.appendChild(text);
      this._listEl.appendChild(li);
      this.setSelection(empty);
      div = document.createElement('div');
      div.className = 'dropdown-item-wrapper';
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        li = document.createElement('li');
        li.className = 'dropDownItem';
        this._map.push({
          el: li,
          value: item,
          searchValue: helper.format.getUniversalString(item.value).toLowerCase().replace(/\s/g, "")
        });
        text = document.createTextNode(item.value);
        li.appendChild(text);
        div.appendChild(li);
        if (item.selected) {
          this.setSelection(item);
        }
      }
      this._listEl.appendChild(div);
    };

    ComponentDropdown.prototype.setSelection = function(selectedItem) {
      this.selected = selectedItem;
      if (selectedItem.value === '') {
        this._selectedTextElement.innerHTML = "Select...";
      } else {
        this._selectedTextElement.innerHTML = selectedItem.value;
      }
      this.fire(ComponentDropdown.EventType.CHANGE, this.selected);
    };

    ComponentDropdown.prototype.setSelectionById = function(id) {
      var item, _i, _len, _ref;
      _ref = this._data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.id === id) {
          this.setSelection(item);
          break;
        }
      }
    };

    ComponentDropdown.prototype.setSelectionByValue = function(value) {
      var item, _i, _len, _ref;
      _ref = this._data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.value === value) {
          this.setSelection(item);
          break;
        }
      }
    };

    ComponentDropdown.prototype.changeData = function(data) {
      this._listEl.innerHTML = "";
      this._fillWithData(data);
    };

    ComponentDropdown.prototype._makeSelection = function(src, onClick) {
      var selection;
      selection = this._map.filter(function(item) {
        return item.el === src.target;
      });
      if (selection.length > 0) {
        this.setSelection(selection[0].value);
        this._listEl.style.visibility = 'hidden';
        document.body.removeEventListener(ComponentBase.EventType.CLICK, onClick, false);
        this.fire(ComponentDropdown.EventType.CHANGE, this.selected);
      }
    };

    ComponentDropdown.prototype.createDom = function() {
      this.element = document.createElement("div");
      this.element.id = 'component-' + this.componentId;
      this.element.className = 'dropDownDiv';
      this.element.appendChild(this._selectedTextElement);
      this.element.appendChild(this._listEl);
    };

    ComponentDropdown.prototype.setEnabled = function(enabled) {
      var selection;
      this._enabled = enabled;
      selection = this._selectedTextElement.classList;
      if (enabled) {
        return selection.remove("disabled");
      } else {
        return selection.add("disabled");
      }
    };

    ComponentDropdown.prototype.getIsEnabled = function() {
      return this._enabled;
    };

    ComponentDropdown.prototype.handleSearch = function() {
      var item, stringFromInput, stringFromMap, _i, _len, _ref;
      if (this.searchEl.value.length > 0) {
        _ref = this._map;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          stringFromMap = item.searchValue;
          stringFromInput = helper.format.getUniversalString(this.searchEl.value).toLowerCase().replace(/\s/g, "");
          if (stringFromMap.indexOf(stringFromInput === -1)) {
            item.el.style.display = "none";
          } else {
            item.el.style.display = "list-item";
          }
        }
      }
    };

    return ComponentDropdown;

  })(ComponentBase);

  ComponentDropdown.EventType = {
    CHANGE: 'dropdown-change'
  };

  ComponentDropdown.State = {
    ENABLED: 'dropdown',
    DISABLED: 'dropdown disabled'
  };

  ComponentDropdown.EmptyOption = {
    value: "",
    id: -1
  };

  ComponentDropdown.SEARCH_FROM_ITEMS_COUNT = 10;

  module.exports = ComponentDropdown;

}).call(this);
