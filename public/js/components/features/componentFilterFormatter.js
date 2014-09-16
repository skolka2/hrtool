var ComponentFilterFormatter = {
    /**
     * Function will transform general object to object for dropdown
     * @param data - object of objects to transform
     * @param idKey - key in general object which value will be used as value of key id in result object
     * @param valueKey - key in general object which value will be used as value of key value in result object
     * @param [dependencyKeys] - array of dependency keys for each dropdown
     * @returns {{}} - object for dropdown
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
     * Function will delete items in dropdowns for which there is no items in last dropdowns
     * @param data - array of objects for dropdowns
     * @param notDeletedDropdowns - array of indexes of dropdowns which cannot be deleted from
     * @returns {*} - data object for componentFilter
     */
    format: function (data) {
        var allowedIds = new Array(data.length);
        var processed = [data.length - 1];
        for(var i = 0; i < allowedIds.length; i++){
            allowedIds[i] = {};
        }

        for (var i = data.length - 1; i >= 0; i--){
            if (i !== data.length - 1 && allowedIds[i] && processed[i]) {
                for (var j in data[i]) {
                    var dropItems = data[i][j];
                    for (var k = dropItems.length - 1; k >= 0; k--) {
                        if (!allowedIds[i][dropItems[k].id]) {
                            dropItems.splice(k, 1);
                        }
                    }
                    if (dropItems.length === 0) {
                        delete data[i][j];
                    }
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
                if(!added){
                    allowedIds[k - 1][keyArr[k - 1]] = true;
                    processed[k - 1] = true;
                }
            }
        }
        return data;
    },
    factory : {
        /**
         * Function will create data for componentFilter using functions transform and format
         * @param departments - data for first dropdown
         * @param teams - data for second dropdown
         * @param templates - data for third dropdown
         * @returns {*} - data for componentFilter
         */
        createTemplateDropdowns : function(departments, teams, templates){
            var res = ComponentFilterFormatter.format([
                ComponentFilterFormatter.transform(departments, 'id_department', 'title'),
                ComponentFilterFormatter.transform(teams, 'id_team', 'title', ['id_department']),
                ComponentFilterFormatter.transform(templates, 'id_task_template', 'title', ['id_department', 'id_team'])
            ]);
            return res;
        },
        createTeamDropdowns : function(departments, teams){
            var res = ComponentFilterFormatter.format([
                ComponentFilterFormatter.transform(departments, 'id_department', 'title'),
                ComponentFilterFormatter.transform(teams, 'id_team', 'title', ['id_department'])
            ]);
            return res;
        },
        createNewTaskDropdowns : function(departments, teams, users){
            var res = ComponentFilterFormatter.format([
                ComponentFilterFormatter.transform(departments, 'id_department', 'title'),
                ComponentFilterFormatter.transform(teams, 'id_team', 'title', ['id_department']),
                ComponentFilterFormatter.transform(users, 'id_user', 'email', ['id_department', 'id_team'])
            ]);
            return res
        }
    }
};

module.exports = ComponentFilterFormatter;