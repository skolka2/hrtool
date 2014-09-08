/**
 * Constructor of class Observer: creates new map of components
 * (an object /associative array/, where the key is the component's ID
 * and the value is its parent's ID.
 * 
 * It also creates a map of publishers with this structure:
 * map {object}
 * |
 * |-------type of event {object}
 * |         |----publisher's ID {object}
 * |         |            |----function to call {function}
 * |         |----publisher's ID {object}
 * |                      |----function to call {function}
 * |
 * |-------type of event {object}
 *           |----publisher's ID {object}
 *           |            |----function to call {function}
 *           |----publisher's ID {object}
 *                        |----function to call {function}
 * @returns {Observer}
 */
var Observer = module.exports = function () {
    this._subscribers = {};
    this.mapOfComponents = {};
};

/**
 * Fires an event and notifies all parents listening to the event type.
 * @param {string} type type of event being fired
 * @param {type} data data to pass on the listeners
 * @param {number} src source of event
 * @returns {undefined}
 */
Observer.prototype.fire = function (type, data, src) {
    var parents = this._getParents(src);
    
    while(parents.length > 0) {
        var id = parents.pop();
        if(this._subscribers[type] && this._subscribers[type][id]) {
            this._subscribers[type][id](data, src);
        }
    }
};

/**
 * Finds all components that contains (directly or not) given component.
 * @param {number} childId Id of component that we want to find parents of.
 * @returns {Observer.prototype._getParents.parents|Array}
 */
Observer.prototype._getParents = function(childId) {
    var parents = [];
    var iter = childId;
    
    while(iter) {
        parents.push(iter);
        iter = this.mapOfComponents[iter];
    }
    
    return parents;
};

/**
 * Subscribes caller to given type of event.
 * @param {ObservableComponent} calee caller of the function
 * @param {string} type type of event
 * @param {function} fn function to call when event triggered
 * @param {object} owner ObservableComponent that fired an event
 * @returns {undefined}
 */
Observer.prototype.on = function (type, fn, owner) {
    if(typeof (fn) !== "function") {
        return;
    }

    if(this._subscribers[type] === undefined) {
        this._subscribers[type] = {};
    }

    var typeItem = this._subscribers[type];

    if(typeItem[owner.componentId] === undefined) {
        typeItem[owner.componentId] = {};
    }

    typeItem[owner.componentId] = fn;
};

/**
 * Removes all listeners of given component's id
 * @param {number} listenerId
 * @returns {undefined}
 */
Observer.prototype.removeListener = function (listenerId) {
    for(var itemEvent in this._subscribers) {
        if(listenerId in this._subscribers[itemEvent]) {
            delete this._subscribers[itemEvent][listenerId];
        }
    }
};
