var BaseComponent, ComponentPopup,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseComponent = require("./componentBase");

module.exports = ComponentPopup = (function(_super) {
    __extends(ComponentPopup, _super);

    function ComponentPopup(triggerEl, insideComponent) {
        this.triggerEl = triggerEl;
        this.insideComponent = insideComponent;
        ComponentPopup.__super__.constructor.apply(this, arguments);
        this.insideEl = this.insideComponent.element;
        this.triggerEl.addEventListener('click', this.open.bind(this), false);
        this.rendered = false;
    }

    ComponentPopup.prototype.open = function() {
        this.mainDiv.classList.add('popup-opened');
        this.mainDiv.addEventListener('click', this.handleOuterClick.bind(this), false);
        return this.fire('popup_open', {});
    };

    ComponentPopup.prototype.handleOuterClick = function(ev) {
        if (ev.target === this.mainDiv || ev.target === this.container || ev.target === this.closeCrossDiv) {
            return this.mainDiv.classList.remove('popup-opened');
        }
    };

    ComponentPopup.prototype.close = function() {
        return this.fire('popup_close', {});
    };

    ComponentPopup.prototype.createDom = function() {
        this.mainDiv = document.createElement('div');
        this.container = document.createElement('div');
        this.innerDiv = document.createElement('div');
        this.closeCrossDiv = document.createElement('div');
        this.mainDiv.className = 'popup-main';
        this.container.className = 'popup-container';
        this.innerDiv.className = 'popup-inner';
        this.closeCrossDiv.className = 'popup-close-cross';
        this.addChild('popup_' + this.insideComponent.componentId, this.insideComponent, {
            'el': this.innerDiv
        });
        this.container.appendChild(this.innerDiv);
        this.container.appendChild(this.closeCrossDiv);
        this.mainDiv.appendChild(this.container);
        return this.element = this.mainDiv;
    };

    return ComponentPopup;

})(BaseComponent);