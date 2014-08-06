/**
 * Constructor of Observable component: creates new component
 * and provides it with a new ID.
 * @returns {ObservableComponent}
 */
var ObservableComponent = function() {
    this.componentId = ++ObservableComponent._componentId;
};

ObservableComponent._componentId = 0;

ObservableComponent.getObserver = function () {
    if(!ObservableComponent.observer) {
        ObservableComponent.observer = new Observer();
    }
    
    return ObservableComponent.observer;
};

/**
 * Lets the component listen to an event of given type fired by given sources.
 * Listens to all sources when src is not provided.
 * @param {string} type type of event to listen
 * @param {function} fn function to call when event triggered
 * @param {array} src sources to listen to
 * @returns {undefined}
 */
ObservableComponent.prototype.listen = function (type, fn, src) {
    ObservableComponent.getObserver().on(this, type, fn, src);
};

/**
 * Fires an event of given type with data provided.
 * @param {string} type type of event being fired
 * @param {type} data anything to be passed on the listeners
 * @returns {undefined}
 */
ObservableComponent.prototype.notify = function (type, data) {
    ObservableComponent.getObserver().fire(type, data, this.componentId);
};

/**
 * Sets the compnent as parent of given ObservableComponent.
 * @param {ObservableComponent} child child to be adopted
 * @returns {undefined}
 */
ObservableComponent.prototype.setAsParent = function (child) {
    ObservableComponent.getObserver().mapOfComponents[child.componentId] = this.componentId;
};

/**
 * Deletes the component from map of components, unsubscribes it from all
 * listeners and removes it as a source from observer.
 * @returns {undefined}
 */
ObservableComponent.prototype.destroyComponent = function () {
    delete ObservableComponent.getObserver().componentMap[this.componentId];
    
    ObservableComponent.getObserver().removeListener(this.componentId);
};
