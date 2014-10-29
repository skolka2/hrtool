(function() {
  var ComponentBase, ComponentTabbedArea,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../componentBase');

  ComponentTabbedArea = (function(_super) {
    __extends(ComponentTabbedArea, _super);

    function ComponentTabbedArea(_tabNames, componentsArray) {
      var component, components, i, j, name, _i, _j, _len, _len1, _ref;
      this._tabNames = _tabNames;
      this.handleClickEvent = __bind(this.handleClickEvent, this);
      ComponentTabbedArea.__super__.constructor.call(this);
      this._currentTab = 0;
      this._tabs = [];
      this._divs = [];
      for (i = _i = 0, _len = componentsArray.length; _i < _len; i = ++_i) {
        components = componentsArray[i];
        this._divs.push(document.createElement('div'));
        this._divs[i].className = ComponentTabbedArea.UNSELECTED_TAB_DIV_CLASS;
        for (j = _j = 0, _len1 = components.length; _j < _len1; j = ++_j) {
          component = components[j];
          name = "tabbedArea-" + this._tabNames[i] + "-component-" + j;
          this.addChild(name, component, {
            el: this._divs[i]
          });
        }
      }
      if ((_ref = this._divs[0]) != null) {
        _ref.className = ComponentTabbedArea.SELECTED_TAB_DIV_CLASS;
      }
    }

    ComponentTabbedArea.prototype.createDom = function() {
      var a, divWrapper, i, li, name, tabName, ul, _i, _len, _ref;
      this.element = document.createElement('div');
      divWrapper = document.createElement('div');
      ul = document.createElement('ul');
      this.element.className = ComponentTabbedArea.WRAPPER_CLASS;
      divWrapper.className = ComponentTabbedArea.DIVS_WRAPPER_CLASS;
      ul.className = ComponentTabbedArea.TABS_CLASS;
      _ref = this._tabNames;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        tabName = _ref[i];
        li = document.createElement('li');
        a = document.createElement('a');
        a.className = i === this._currentTab ? ComponentTabbedArea.SELECTED_TAB_CLASS : ComponentTabbedArea.UNSELECTED_TAB_CLASS;
        a.div_index = i;
        name = document.createTextNode(tabName);
        this._tabs.push(a);
        a.appendChild(name);
        li.appendChild(a);
        ul.appendChild(li);
        divWrapper.appendChild(this._divs[i]);
      }
      this.element.appendChild(ul);
      this.element.appendChild(divWrapper);
      this.element.addEventListener(ComponentBase.CLICK_EVENT, this.handleClickEvent, false);
    };

    ComponentTabbedArea.prototype.handleClickEvent = function(ev) {
      if (ev.srcElement.div_index != null) {
        this._divs[this._currentTab].className = ComponentTabbedArea.UNSELECTED_TAB_DIV_CLASS;
        this._tabs[this._currentTab].className = ComponentTabbedArea.UNSELECTED_TAB_CLASS;
        this._currentTab = ev.srcElement.div_index;
        this._divs[this._currentTab].className = ComponentTabbedArea.SELECTED_TAB_DIV_CLASS;
        this._tabs[this._currentTab].className = ComponentTabbedArea.SELECTED_TAB_CLASS;
      }
    };

    ComponentTabbedArea.prototype.getSelectedTabNumber = function() {
      return this._currentTab;
    };

    return ComponentTabbedArea;

  })(ComponentBase);

  ComponentTabbedArea.WRAPPER_CLASS = 'tabbed-area';

  ComponentTabbedArea.DIVS_WRAPPER_CLASS = 'box-wrap';

  ComponentTabbedArea.TABS_CLASS = 'tabs';

  ComponentTabbedArea.SELECTED_TAB_CLASS = 'tab-selected';

  ComponentTabbedArea.UNSELECTED_TAB_CLASS = 'tab-unselected';

  ComponentTabbedArea.SELECTED_TAB_DIV_CLASS = 'tab-div-selected';

  ComponentTabbedArea.UNSELECTED_TAB_DIV_CLASS = 'tab-div-unselected';

  module.exports = ComponentTabbedArea;

}).call(this);
