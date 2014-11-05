(function() {
  var ComponentBase, ComponentDropdown, ComponentFilter, ComponentPopup, ComponentTableWrapper, ComponentTextInput,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../componentBase');

  ComponentDropdown = require('../features/componentDropdown');

  ComponentFilter = require('../features/componentFilter');

  ComponentTextInput = require('../features/componentTextInput');

  ComponentPopup = require('../componentPopup');

  ComponentTableWrapper = (function(_super) {
    __extends(ComponentTableWrapper, _super);

    function ComponentTableWrapper(_table, _filterComponent, _textInput) {
      this._table = _table;
      this._filterComponent = _filterComponent;
      this._textInput = _textInput;
      this.handleFilterTable = __bind(this.handleFilterTable, this);
      ComponentTableWrapper.__super__.constructor.call(this);
    }

    ComponentTableWrapper.prototype.createDom = function() {
      var topDiv;
      this.element = document.createElement('div');
      this.element.className = ComponentTableWrapper.WRAPPER_CLASS;
      topDiv = document.createElement('div');
      topDiv.className = ComponentTableWrapper.TOP_DIV_CLASS;
      this.element.appendChild(topDiv);
      this.addChild('componentFilter', this._filterComponent, {
        el: topDiv
      });
      this.addChild('textInput', this._textInput, {
        el: topDiv
      });
      this.addChild('table', this._table, {
        el: this.element
      });
      this.listen(ComponentFilter.eventType.UPDATED, this._filterComponent, this.handleFilterTable);
      this.listen(ComponentTextInput.eventType.INPUT_CHANGE, this._textInput, this.handleFilterTable);
    };

    ComponentTableWrapper.prototype.handleFilterTable = function() {
      var filterData, i, item, name, status1, _i, _len;
      status1 = this._filterComponent.getStatus();
      filterData = {
        filter: []
      };
      for (i = _i = 0, _len = status1.length; _i < _len; i = ++_i) {
        item = status1[i];
        if (item.id !== -1) {
          filterData.filter.push(item.id);
        } else {
          filterData.filter.splice(i + 1, i + 1);
        }
      }
      name = this._textInput.getStatus();
      if (name) {
        filterData.input = '%' + name + '%';
      }
      if (Object.keys(filterData).length <= 1 && filterData.filter.length <= 0) {
        filterData = null;
      }
      this._table.handleOnFilter(filterData);
    };

    return ComponentTableWrapper;

  })(ComponentBase);

  ComponentTableWrapper.WRAPPER_CLASS = 'filter-table';

  ComponentTableWrapper.TOP_DIV_CLASS = 'filter-table-top_div';

  module.exports = ComponentTableWrapper;

}).call(this);
