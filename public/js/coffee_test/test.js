(function() {
  var ComponentBase, Testik,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ComponentBase = require('../components/componentBase');

  Testik = (function(_super) {
    __extends(Testik, _super);

    function Testik(textContent) {
      this.textContent = textContent;
      this.alertInfo = __bind(this.alertInfo, this);
      Testik.__super__.constructor.apply(this, arguments);
      return;
    }

    Testik.prototype.addTrigger = function(parentEl) {
      var but;
      but = document.createElement('button');
      but.innerHTML = Testik.BUTTON_LABEL;
      but.addEventListener(ComponentBase.EventType.CLICK, this.alertInfo);
      parentEl.appendChild(but);
    };

    Testik.prototype.alertInfo = function(ev) {
      alert(this.textContent);
      console.log(this.textContent);
    };

    return Testik;

  })(ComponentBase);

  Testik.BUTTON_LABEL = 'click me';

  module.exports = Testik;

}).call(this);
