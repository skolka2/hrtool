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
 * @param {array} src sources to listen to
 * @param {scope} scope of function to call
 * @param {function} fn function to call when event triggered
 * @returns {undefined}
 */
ObservableComponent.prototype.listen = function (type, src, scope, fn) {
    fn.bind(scope);
    ObservableComponent.getObserver().on(this, type, fn, src);
};

/**
 * Fires an event of given type with data provided.
 * @param {string} type type of event being fired
 * @param {type} data anything to be passed on the listeners
 * @returns {undefined}
 */
ObservableComponent.prototype.fire = function (type, data) {
    ObservableComponent.getObserver().fire(type, data, this.componentId);
};

/**
 * Sets the compnent as parent of given ObservableComponent.
 * @param {ObservableComponent} child child to be adopted
 * @returns {undefined}
 */
ObservableComponent.prototype.setAsChild = function (child) {
    ObservableComponent.getObserver().mapOfComponents[child.componentId] = this.componentId;
};

/**
 * Deletes the component from map of components, unsubscribes it from all
 * listeners and removes it as a source from observer.
 * @param {number} componentId ID of component to remove
 * @returns {undefined}
 */
ObservableComponent.prototype.removeListeners = function (componentId) {
    if(ObservableComponent.getObserver().mapOfComponents[componentId])
        delete ObservableComponent.getObserver().mapOfComponents[componentId];
    ObservableComponent.getObserver().removeListener(componentId);
};
