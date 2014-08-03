var Observer = function() {
    this._subscribers = {};
};

Observer.prototype.fire = function (type, src, data) {
    var itemType = this._subscribers[type];
    for(var subsc in itemType) {
        if (itemType[subsc].src === undefined || itemType[subsc].src.indexOf(src) > -1) {
            itemType[subsc].func(data);
        }
    };
};

Observer.prototype.on = function (owner, type, fn, source) {
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

Observer.prototype.removeListener = function (listenerId) {
    for(var itemEvent in this._subscribers) {
        if(listenerId in this._subscribers[itemEvent]) {
            delete this._subscribers[itemEvent][listenerId];
        }
    }
};


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
