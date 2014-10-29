(function() {
  var ComponentFilterFormatter;

  ComponentFilterFormatter = {
    transform: function(data, idKey, valueKey, dependencyKeys) {
      var depKey, id, item, j, key, obj, res, _i, _len;
      id = '';
      res = {};
      for (key in data) {
        item = data[key];
        obj = {
          id: item[idKey],
          value: item[valueKey]
        };
        if (dependencyKeys != null) {
          for (j = _i = 0, _len = dependencyKeys.length; _i < _len; j = ++_i) {
            depKey = dependencyKeys[j];
            id += item[depKey] || 'global';
            if (j !== dependencyKeys.length - 1) {
              id += '-';
            }
          }
        }
        if (res[id] == null) {
          res[id] = [];
        }
        res[id].push(obj);
        id = '';
      }
      return res;
    },
    format: function(data) {
      var added, allowedIds, dataItem, dropItem, dropItems, i, k, key, keyArr, keyPart, processed, _i, _j, _k, _l, _len, _ref;
      allowedIds = new Array(data.length);
      processed = [data.length - 1];
      for (i = _i = 0, _ref = allowedIds.length; _i < _ref; i = _i += 1) {
        allowedIds[i] = {};
      }
      for (i = _j = data.length - 1; _j >= 0; i = _j += -1) {
        dataItem = data[i];
        if (i !== data.length - 1 && allowedIds[i] && processed[i]) {
          for (key in dataItem) {
            dropItems = dataItem[key];
            for (k = _k = dropItems.length - 1; _k >= 0; k = _k += -1) {
              dropItem = dropItems[k];
              if (!allowedIds[i][dropItem.id]) {
                dropItems.splice(k, 1);
              }
            }
            if (dropItems.length === 0) {
              delete data[i][key];
            }
          }
        }
        for (key in dataItem) {
          keyArr = key.split('-');
          added = false;
          for (k = _l = 0, _len = keyArr.length; _l < _len; k = ++_l) {
            keyPart = keyArr[k];
            if (keyPart === 'global' && k - 1 >= 0) {
              allowedIds[k - 1][keyArr[k - 1]] = true;
              added = true;
              break;
            }
          }
          if (added === false) {
            allowedIds[k - 1][keyArr[k - 1]] = true;
            processed[k - 1] = true;
          }
        }
      }
      return data;
    },
    factory: {
      createTemplateDropdownsData: function(departments, teams, templates) {
        return ComponentFilterFormatter.format([ComponentFilterFormatter.transform(departments, 'id_department', 'title'), ComponentFilterFormatter.transform(teams, 'id_team', 'title', ['id_department']), ComponentFilterFormatter.transform(templates, 'id_task_template', 'title', ['id_department', 'id_team'])]);
      },
      createTeamDropdownsData: function(departments, teams) {
        return ComponentFilterFormatter.format([ComponentFilterFormatter.transform(departments, 'id_department', 'title'), ComponentFilterFormatter.transform(teams, 'id_team', 'title', ['id_department'])]);
      },
      createUsersDropdownsData: function(departments, teams, users) {
        return ComponentFilterFormatter.format([ComponentFilterFormatter.transform(departments, 'id_department', 'title'), ComponentFilterFormatter.transform(teams, 'id_team', 'title', ['id_department']), ComponentFilterFormatter.transform(users, 'id_user', 'full_name', ['id_department', 'id_team'])]);
      },
      createTeamRoleDropdownsData: function(departments, role, teams) {
        return ComponentFilterFormatter.format([ComponentFilterFormatter.transform(departments, 'id_department', 'title'), ComponentFilterFormatter.transform(role, 'id_department_role', 'title', ['id_department']), ComponentFilterFormatter.transform(teams, 'id_team', 'title', ['id_department'])]);
      }
    }
  };

  module.exports = ComponentFilterFormatter;

}).call(this);
