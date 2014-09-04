var ComponentFilterFormater = function(){

};

ComponentFilterFormater.Factory = {
    /**
     *
     * @param data
     * @param idKey
     * @param valueKey
     * @param dependencyKeys
     * @returns {{}}
     */
    transform: function (data, idKey, valueKey, dependencyKeys) {
        var id = '';
        var res = {};
        for (var i in data) {
            var item = {};
            item = {
                id: data[i][idKey],
                value: data[i][valueKey]
            };
            if (dependencyKeys) {
                for (var j = 0; j < dependencyKeys.length; j++) {
                    id += data[i][dependencyKeys[j]] || 'global';
                    if (j !== dependencyKeys.length - 1) id += '-';
                }
            }
            res[id] = res[id] || [];
            res[id].push(item);
            id = '';
        }
        return res;
    },
    /**
     *
     * @param data
     * @returns {*}
     */
    format: function (data) {
        var allowedIds = new Array(data.length);
        for(var i = 0; i < allowedIds.length; i++)  allowedIds[i] = {};

        for (var i = data.length - 1; i >= 0; i--) {
            if (i !== data.length - 1) {
                for (var j in data[i]) {
                    var dropItems = data[i][j];
                    for (var k = dropItems.length - 1; k >= 0; k--) {
                        if (!allowedIds[i][dropItems[k].id]) {
                            dropItems.splice(k, 1);
                        }
                    }
                    if (dropItems.length === 0) delete data[i][j];
                }
            }
            var keys = Object.keys(data[i]);
            for (var j = 0; j < keys.length; j++) {
                var keyArr = keys[j].split('-');
                var added = false;
                var k;
                for(k = 0; k < keyArr.length; k++){
                    if (keyArr[k] === 'global' && k - 1 >= 0) {
                        allowedIds[k - 1][keyArr[k - 1]] = true;
                        added = true;
                        break;
                    }
                }
                if(!added) allowedIds[k - 1][keyArr[k - 1]] = true;
            }
        }
        return data;
    }
};