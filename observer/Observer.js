var Observer = function() {
    this._subscribers = {};
};

/**
 * Fires an event and notifies all listeners of the event if they listen to the
 * source.
 * @param {string} type type of event being fired
 * @param {type} data data to pass on the listeners
 * @param {number} src source of event
 * @returns {undefined}
 */
Observer.prototype.fire = function (type, data, src) {
    var itemType = this._subscribers[type];
    for(var subsc in itemType) {
        if (itemType[subsc].src === undefined
                || (src !== undefined && itemType[subsc].src.indexOf(src) > -1)) {
            
            itemType[subsc].func(data);
        }
    };
};

/**
 * Subscribes caller to given type of event.
 * @param {object} owner caller that wants to be informed
 * @param {string} type type of event
 * @param {function} fn function to call when event triggered
 * @param {array} source array of 
 * @returns {undefined}
 */
Observer.prototype.on = function (owner, type, fn, source) {
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
    
    var ownerItem = typeItem[owner.componentId];
    
    ownerItem.func = fn.bind(owner);
    ownerItem.src = source;
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

/**
 * Removes given component's id from all listeners' sources
 * @param {type} listenerId
 * @returns {undefined}
 */
Observer.prototype.removeAsSource = function (listenerId) {
    for(var itemEvent in this._subscribers) {
        var idList = this._subscribers[itemEvent];

        for(var itemId in idList) {
            var index = idList[itemId].src.indexOf(listenerId);

            if(index > -1) {
                idList[itemId].src.splice(index, 1);
            }
        }
    }
};

/**
 * Add source to be listen to on given source
 * @param {string} type
 * @param {number} subscriberId
 * @param {number} sourceId
 * @returns {undefined}
 */
Observer.prototype.addSourceToListener = function (type, subscriberId, sourceId) {
    if(this._subscribers[type][subscriberId].src !== undefined)
        this._subscribers[type][subscriberId].src.push(sourceId);
};

/**
 * Unsubscribe from source
 * @param {string} type
 * @param {number} subscriberId
 * @param {number} sourceId
 * @returns {undefined}
 */
Observer.prototype.removeSourceFromListener = function (type, subscriberId, sourceId) {
    if(this._subscribers[type][subscriberId].src !== undefined) {
        var index = this._subscribers[type][subscriberId].src.indexOf(sourceId);
        this._subscribers[type][subscriberId].src.splice(index, 1);
    }
};
