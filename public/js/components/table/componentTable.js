(function() {
  var ComponentBase, ComponentTable, Model, helper, hrtool,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../componentBase');

  helper = require('../../helpers/helpers');

  Model = require('../../models/model');

  hrtool = require('../../models/actions');

  ComponentTable = (function(_super) {
    __extends(ComponentTable, _super);

    function ComponentTable(tableFormat, tableSettings) {
      this.handleLoadMore = __bind(this.handleLoadMore, this);
      this.handleOnClick = __bind(this.handleOnClick, this);
      this.handleOnFilter = __bind(this.handleOnFilter, this);
      ComponentTable.__super__.constructor.call(this);
      this._action = tableSettings.actionFunc;
      this._endpoint = tableSettings.endpoint;
      this.reqData = {
        limit: tableSettings.limit + 1,
        offset: tableSettings.offset,
        sortBy: tableSettings.sortBy,
        sort_way: tableSettings.sort_way,
        filterData: null
      };
      this.previousTarget = null;
      this.headerTitles = tableFormat();
      this.getElement();
      this.divLoadMore = null;
    }

    ComponentTable.prototype.setFilterData = function(filterParams) {
      this.reqData.filterData = filterParams;
    };

    ComponentTable.prototype.getFilterData = function() {
      return this.reqData.filterData;
    };

    ComponentTable.prototype.deleteFilterData = function() {
      return this.reqData.filterData = null;
    };

    ComponentTable.prototype.handleOnFilter = function(ev) {
      this.divTable.innerHTML = '';
      this.reqData.offset = 0;
      return this.reloadData();
    };

    ComponentTable.prototype.createDom = function() {
      var header, wrapper;
      wrapper = document.createElement("div");
      wrapper.className = 'table-wrapper';
      header = helper.tpl.create("components/table/componentTable", {
        array: this.headerTitles
      });
      header.addEventListener(ComponentBase.eventType.CLICK, this.handleOnClick);
      wrapper.appendChild(header);
      return this.element = wrapper;
    };

    ComponentTable.prototype.onLoad = function(data) {
      var dataLimit, divTable, i, _i;
      divTable = this.getDivTable();
      this.getDivLoadMore();
      if (this.reqData.limit === data.length) {
        dataLimit = data.length - 1;
        this.divLoadMore.style.display = 'block';
      } else {
        dataLimit = data.length;
        this.divLoadMore.style.display = 'none';
      }
      for (i = _i = 0; _i < dataLimit; i = _i += +1) {
        this.addRow(data[i], divTable);
      }
      this.reqData.offset += dataLimit;
    };

    ComponentTable.prototype.getDivTable = function() {
      if (this.divTable == null) {
        this.divTable = document.createElement("div");
        this.divTable.className = 'table';
        this.getElement().appendChild(this.divTable);
      }
      return this.divTable;
    };

    ComponentTable.prototype.getDivLoadMore = function() {
      if (this.divLoadMore == null) {
        this.divLoadMore = document.createElement('div');
        this.divLoadMore.className = 'load-more';
        this.divLoadMore.innerHTML = "load more..";
        this.divLoadMore.addEventListener(ComponentBase.eventType.CLICK, this.handleLoadMore);
        this.getElement().appendChild(this.divLoadMore);
      }
      return this.divLoadMore;
    };

    ComponentTable.prototype.addRow = function(data, divTable) {
      var divCol, innerCol, item, params, row, tableStruct, _i, _j, _len, _len1, _ref, _ref1, _results;
      row = document.createElement("div");
      row.className = 'table-row';
      divTable.appendChild(row);
      _ref = this.headerTitles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tableStruct = _ref[_i];
        divCol = document.createElement("div");
        divCol.className = 'table-column';
        params = [];
        _ref1 = tableStruct.keys;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          item = _ref1[_j];
          params.push(data[item]);
        }
        innerCol = helper.dom.createElement(tableStruct.formatter(params));
        divCol.appendChild(innerCol);
        _results.push(row.appendChild(divCol));
      }
      return _results;
    };

    ComponentTable.prototype.handleOnClick = function(ev) {
      var sortBy, sort_way, target;
      target = ev.target;
      sortBy = target.getAttribute("sort-by");
      if (sortBy !== null) {
        if (this.reqData.sortBy !== sortBy) {
          target.className = "header-column sortable active-sort " + ComponentTable.SORT_ASC;
          if (target !== this.previousTarget && this.previousTarget !== null) {
            this.previousTarget.className = 'header-column sortable ' + ComponentTable.SORT_ASC;
          }
        } else {
          sort_way = ComponentTable.SORT_DESC === this.reqData.sort_way ? ComponentTable.SORT_ASC : ComponentTable.SORT_DESC;
          target.className = "header-column sortable active-sort " + sort_way;
        }
        this.sortData(sortBy);
        return this.previousTarget = target;
      }
    };

    ComponentTable.prototype.handleLoadMore = function() {
      return this.reloadData();
    };

    ComponentTable.prototype.sortData = function(sortBy) {
      var inTable;
      inTable = this.getElement().getElementsByClassName('table')[0];
      inTable.innerHTML = "";
      this.reqData.offset = 0;
      if (this.reqData.sort_way === ComponentTable.SORT_DESC || this.reqData.sortBy !== sortBy) {
        this.reqData.sort_way = ComponentTable.SORT_ASC;
      } else {
        this.reqData.sort_way = ComponentTable.SORT_DESC;
      }
      this.reqData.sortBy = sortBy;
      this.reloadData();
    };

    ComponentTable.prototype.reloadData = function() {
      var reloadModel;
      reloadModel = new Model(this._endpoint);
      this.listen(this._endpoint, reloadModel, this.onLoad);
      return this._action(reloadModel, this.reqData);
    };

    return ComponentTable;

  })(ComponentBase);

  ComponentTable.SORT_DESC = 'DESC';

  ComponentTable.SORT_ASC = 'ASC';

  module.exports = ComponentTable;

}).call(this);
