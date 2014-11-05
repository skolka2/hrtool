(function() {
  var ComponentBase, ComponentCheckBox,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../componentBase');

  ComponentCheckBox = (function(_super) {
    __extends(ComponentCheckBox, _super);

    function ComponentCheckBox(labelText, checked) {
      this.labelText = labelText != null ? labelText : '';
      this.checked = checked;
      this.handleOnClick = __bind(this.handleOnClick, this);
      ComponentCheckBox.__super__.constructor.call(this);
    }

    ComponentCheckBox.prototype.createDom = function() {
      var buddyCheckbox;
      buddyCheckbox = document.createElement("div");
      buddyCheckbox.className = "buddy-checkbox";
      buddyCheckbox.id = "buddy-checkbox" + this.componentId;
      this.checkChecked = document.createElement("div");
      this._setCheckClass();
      this.label = document.createElement("div");
      this.label.className = "checkbox-label";
      this.label.innerText = this.labelText;
      buddyCheckbox.appendChild(this.checkChecked);
      buddyCheckbox.appendChild(this.label);
      this.element = buddyCheckbox;
      this.element.addEventListener(ComponentBase.eventType.CLICK, this.handleOnClick, false);
    };

    ComponentCheckBox.prototype._setCheckClass = function() {
      this.checkChecked.className = this.checked ? ComponentCheckBox.checkBoxClass.CHECKED : ComponentCheckBox.checkBoxClass.NOTCHECKED;
    };

    ComponentCheckBox.prototype.handleOnClick = function() {
      this.setChecked(!this.checked);
    };

    ComponentCheckBox.prototype.setCheckBoxTittle = function(tittle) {
      this.labelText = tittle;
      this.label.innerText = tittle;
    };

    ComponentCheckBox.prototype.setChecked = function(checked) {
      this.getElement();
      this.checked = checked;
      this._setCheckClass();
      this.fire(ComponentBase.eventType.CHANGE, this.checked);
    };

    return ComponentCheckBox;

  })(ComponentBase);

  ComponentCheckBox.checkBoxClass = {
    CHECKED: "checkbox checked",
    NOTCHECKED: "checkbox"
  };

  module.exports = ComponentCheckBox;

}).call(this);
