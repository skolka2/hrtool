var Observer = require('./Observer');

/**
 * Constructor of Observable component: creates new component
 * and provides it with a new ID.
 * @returns {EventEmitter}
 */
var EventEmitter = module.exports = function() {
    this.componentId = ++EventEmitter._componentId;
};

EventEmitter._componentId = 0;

EventEmitter.getObserver = function () {
    if(!EventEmitter.observer) {
        EventEmitter.observer = new Observer();
    }
    
    return EventEmitter.observer;
};

/**
 * Lets the component listen to an event of given type fired by given sources.
 * Listens to all sources when src is not provided.
 * @param {string} type type of event to listen
 * @param {object} src sources to listen to
 * @param {function} fn function to call when event triggered
 * @returns {undefined}
 */
EventEmitter.prototype.listen = function (type, src, fn) {
    fn = fn.bind(this);
    EventEmitter.getObserver().on(type, fn, src);
};

/**
 * Fires an event of given type with data provided.
 * @param {string} type type of event being fired
 * @param {type} data anything to be passed on the listeners
 * @returns {undefined}
 */
EventEmitter.prototype.fire = function (type, data) {
    EventEmitter.getObserver().fire(type, data, this.componentId);
};

/**
 * Sets the compnent as parent of given EventEmitter.
 * @param {EventEmitter} child child to be adopted
 * @returns {undefined}
 */
EventEmitter.prototype.setAsChild = function (child) {
    EventEmitter.getObserver().mapOfComponents[child.componentId] = this.componentId;
};

/**
 * Deletes the component from map of components, unsubscribes it from all
 * listeners and removes it as a source from observer.
 * @param {number} componentId ID of component to remove
 * @returns {undefined}
 */
EventEmitter.prototype.removeListeners = function (componentId) {
    if(EventEmitter.getObserver().mapOfComponents[componentId])
        delete EventEmitter.getObserver().mapOfComponents[componentId];
    EventEmitter.getObserver().removeListener(componentId);
};
