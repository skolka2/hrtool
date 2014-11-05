(function() {
  var ComponentBase, ComponentDropdown, ComponentFilter, ComponentNotificationCenter, ComponentSelect,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require("../componentBase");

  ComponentFilter = require("./componentFilter");

  ComponentNotificationCenter = require("../componentNotificationCenter");

  ComponentDropdown = require("../features/componentDropdown");

  module.exports = ComponentSelect = (function(_super) {
    __extends(ComponentSelect, _super);

    function ComponentSelect(data, errorsInfo) {
      this.data = data;
      this.errorsInfo = errorsInfo;
      this.cancel = __bind(this.cancel, this);
      this.handleSave = __bind(this.handleSave, this);
      ComponentSelect.__super__.constructor.call(this);
    }

    ComponentSelect.prototype.createDom = function() {
      var cancelButton, saveButton, selectorEl;
      this.element = this.helper.tpl.create("components/features/componentSelect");
      selectorEl = this.element.getElementsByClassName("selectors-wrapper")[0];
      cancelButton = this.element.getElementsByClassName("select-button-cancel")[0];
      saveButton = this.element.getElementsByClassName("select-button-save")[0];
      cancelButton.addEventListener(ComponentBase.eventType.CLICK, this.cancel, false);
      saveButton.addEventListener(ComponentBase.eventType.CLICK, this.handleSave, false);
      this.filter = new ComponentFilter(this.data);
      return this.addChild(this.filter.componentId, this.filter, {
        "el": selectorEl
      });
    };

    ComponentSelect.prototype.handleSave = function() {
      if (this.isValid()) {
        this.fire(ComponentSelect.eventType.SAVE, this.filter.getStatus());
        this.reset();
        return this.cancel();
      }
    };

    ComponentSelect.prototype.reset = function() {
      var dropdown, _i, _len, _ref, _results;
      _ref = this.filter._dropdowns;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dropdown = _ref[_i];
        _results.push(dropdown.setSelection(ComponentDropdown.EmptyOption));
      }
      return _results;
    };

    ComponentSelect.prototype.isValid = function() {
      var baseTime, i, isValid, item, _i, _len, _ref;
      isValid = true;
      baseTime = ComponentNotificationCenter.DEFAULT_TIME;
      _ref = this.filter.getStatus();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        item = _ref[i];
        if (item.id === -1) {
          this.filter._dropdowns[i].setInvalidInputClass();
          if (this.errorsInfo[i] != null) {
            this.addNotification(this.errorsInfo[i], baseTime, ComponentNotificationCenter.eventType.error);
            baseTime += 1000;
          }
          isValid = false;
        }
      }
      return isValid;
    };

    ComponentSelect.prototype.cancel = function() {
      return this.fire(ComponentSelect.eventType.CANCEL, null);
    };

    ComponentSelect.eventType = {
      SAVE: 'selectSave',
      CANCEL: 'selectCancel'
    };

    return ComponentSelect;

  })(ComponentBase);

}).call(this);
