(function() {
  var ComponentBase, ComponentTextInput,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../componentBase');

  ComponentTextInput = (function(_super) {
    __extends(ComponentTextInput, _super);

    function ComponentTextInput(placeholder) {
      this.placeholder = placeholder;
      this.checkTyping = __bind(this.checkTyping, this);
      this.handleKeyupEvent = __bind(this.handleKeyupEvent, this);
      this.handleDeleteClick = __bind(this.handleDeleteClick, this);
      ComponentTextInput.__super__.constructor.call(this);
      this.fired = false;
    }

    ComponentTextInput.prototype.createDom = function() {
      this.element = document.createElement('div');
      this.element.className = ComponentTextInput.WRAPPER_CLASS;
      this._input = document.createElement('input');
      this._input.placeholder = this.placeholder;
      this._input.addEventListener(ComponentBase.EventType.KEYUP, this.handleKeyupEvent, false);
      this._deleteDiv = document.createElement('div');
      this._deleteDiv.className = ComponentTextInput.DELETE_DIV_CLASS;
      this._deleteDiv.appendChild(document.createTextNode('X'));
      this._deleteDiv.addEventListener(ComponentBase.EventType.CLICK, this.handleDeleteClick, false);
      this.element.appendChild(this._input);
      this.element.appendChild(this._deleteDiv);
    };

    ComponentTextInput.prototype.handleDeleteClick = function(ev) {
      this._input.value = '';
      this.fire(ComponentTextInput.EventType.INPUT_CHANGE, this._input.value);
    };

    ComponentTextInput.prototype.handleKeyupEvent = function(ev) {
      this._oldValue = this._input.value;
      setTimeout(this.checkTyping, ComponentTextInput.DELAY);
      if (this.fired) {
        this.fired = false;
      }
    };

    ComponentTextInput.prototype.checkTyping = function() {
      if (this.fired === false && this._oldValue === this._input.value) {
        this.fire(ComponentTextInput.EventType.INPUT_CHANGE, this._oldValue);
        this.fired = true;
      }
    };

    ComponentTextInput.prototype.getStatus = function() {
      return this._input.value;
    };

    return ComponentTextInput;

  })(ComponentBase);

  ComponentTextInput.WRAPPER_CLASS = 'text-input';

  ComponentTextInput.DELETE_DIV_CLASS = 'text-input-delete';

  ComponentTextInput.DELAY = 500;

  ComponentTextInput.EventType = {
    INPUT_CHANGE: 'input-change'
  };

  module.exports = ComponentTextInput;

}).call(this);
