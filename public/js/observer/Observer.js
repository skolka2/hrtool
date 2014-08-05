var Observer = (function() {
    var instance;
    var _componentId = 1;
    
    var init = function () {
        var _subscribers = {};
        
        return {

            /**
             * Fires an event and notifies all listeners of the event if they listen to the
             * source.
             * @param {string} type type of event being fired
             * @param {type} data data to pass on the listeners
             * @param {number} src source of event
             * @returns {undefined}
             */
            fire: function (type, data, src) {
                var itemType = _subscribers[type];
                for(var subsc in itemType) {
                    if (itemType[subsc].src === undefined
                            || (src !== undefined && itemType[subsc].src.indexOf(src) > -1)) {

                        itemType[subsc].func(data);
                    }
                };
            },

            /**
             * Subscribes caller to given type of event.
             * @param {object} owner caller that wants to be informed
             * @param {string} type type of event
             * @param {function} fn function to call when event triggered
             * @param {array} source array of 
             * @returns {undefined}
             */
            on: function (owner, type, fn, source) {
                if(typeof (fn) !== "function") {
                    return;
                }

                if(_subscribers[type] === undefined) {
                    _subscribers[type] = {};
                }

                var typeItem = _subscribers[type];

                if(typeItem[owner.componentId] === undefined) {
                    typeItem[owner.componentId] = {};
                }

                var ownerItem = typeItem[owner.componentId];

                ownerItem.func = fn.bind(owner);
                ownerItem.src = source;
            },

            /**
             * Removes all listeners of given component's id
             * @param {number} listenerId
             * @returns {undefined}
             */
            removeListener: function (listenerId) {
                for(var itemEvent in _subscribers) {
                    if(listenerId in _subscribers[itemEvent]) {
                        delete _subscribers[itemEvent][listenerId];
                    }
                }
            },

            /**
             * Removes given component's id from all listeners' sources
             * @param {type} listenerId
             * @returns {undefined}
             */
            removeAsSource: function (listenerId) {
                for(var itemEvent in _subscribers) {
                    var idList = _subscribers[itemEvent];

                    for(var itemId in idList) {
                        var index = idList[itemId].src.indexOf(listenerId);

                        if(index > -1) {
                            idList[itemId].src.splice(index, 1);
                        }
                    }
                }
            },

            /**
             * Add source to be listen to on given source
             * @param {string} type
             * @param {number} subscriberId
             * @param {number} sourceId
             * @returns {undefined}
             */
            addSourceToListener: function (type, subscriberId, sourceId) {
                if(_subscribers[type][subscriberId].src !== undefined)
                    _subscribers[type][subscriberId].src.push(sourceId);
            },

            /**
             * Unsubscribe from source
             * @param {string} type
             * @param {number} subscriberId
             * @param {number} sourceId
             * @returns {undefined}
             */
            removeSourceFromListener: function (type, subscriberId, sourceId) {
                if(_subscribers[type][subscriberId].src !== undefined) {
                    var index = _subscribers[type][subscriberId].src.indexOf(sourceId);
                    _subscribers[type][subscriberId].src.splice(index, 1);
                }
            }
        };
    };
    
    return {
        getInstance: function() {
            if(!instance)
                instance = init();
            
            return instance;
        },
        
        getComponentId: function() {
            return _componentId++;
        }
    };
})();
