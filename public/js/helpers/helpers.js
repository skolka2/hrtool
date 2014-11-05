(function() {
  var Const, app, helper;

  Const = require('./constants');

  app = require('../app');

  helper = {
    format: {
      getPercentage: function(num) {
        var result;
        if (!isNaN(num)) {
          return result = (num * 100).toFixed(2) + "%";
        } else {
          return "Can't get the percentage, input is not a number!";
        }
      },
      getDate: function(date) {
        var dateFormated;
        return dateFormated = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
      },
      getDiffDate: function(date1, date2) {
        var diffDays, firstDate, oneDay, secondDate;
        oneDay = 24 * 60 * 60 * 1000;
        firstDate = new Date(date1);
        secondDate = new Date(date2);
        return diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
      },
      dateValidate: function() {
        helper.format.getDateNow();
        if (event.currentTarget.value < time.toString || event.currentTarget.value > time.toString) {
          event.currentTarget.value = time.toString;
        }
      },
      getDateNow: function() {
        var time;
        time = new Date().toLocaleDateString().split(".");
        if (time[1].length === 1) {
          time[1] = "0" + time[1];
        }
        if (time[0].length === 1) {
          time[0] = "0" + time[0];
        }
        return {
          "year": time[2],
          "month": time[1],
          "day": time[0],
          "toString": time[2] + "-" + time[1] + "-" + time[0]
        };
      },
      getUniversalString: function(str) {
        var ch, output, specChars, univChars, _i, _ref;
        specChars = "áäčďéěíĺľňóô öŕšťúů üýřžÁÄČĎÉĚÍĹĽŇÓÔ ÖŔŠŤÚŮ ÜÝŘŽ";
        univChars = "aacdeeillnoo orstuu uyrzAACDEEILLNOO ORSTUU UYRZ";
        output = "";
        for (ch = _i = 0, _ref = str.length; 0 <= _ref ? _i <= _ref : _i >= _ref; ch = 0 <= _ref ? ++_i : --_i) {
          if (specChars.indexOf(ch !== -1)) {
            output += univChars.charAt(specChars.indexOf(ch));
          } else {
            output += ch;
          }
        }
        return output;
      },
      getDateInputFormat: function(date) {
        var day, getDate, getMonth, month;
        getMonth = date.getMonth();
        getDate = date.getDate();
        month = getMonth < 9 ? '0' + (getMonth + 1) : getMonth + 1;
        day = getDate < 10 ? '0' + getDate : getDate;
        return date.getFullYear() + '-' + month + '-' + day;
      }
    },
    dom: {
      createElement: function(str) {
        var myElement;
        myElement = $(str);
        return myElement[0];
      },
      getParentByClass: function(el, className) {
        while (el && el.className !== className) {
          el = el.parentNode;
        }
        if (el) {
          return el;
        } else {
          return null;
        }
      }
    },
    tpl: {
      create: function(name, params) {
        var template;
        template = require("jade!../../js/" + name + ".jade");
        return helper.dom.createElement(template(params));
      }
    },
    bulk: {
      getData: function(keys) {
        return helper.obj.getData(app.bulk, keys);
      },
      getDepartmentData: function() {
        if ((this.getData(['user', 'id_user_role'])) !== Const.ADMINISTRATOR) {
          return this.getData(['userDepartments']);
        } else {
          return this.getData(['departments']);
        }
      },
      getTeamData: function() {
        if ((this.getData(['user', 'id_user_role'])) !== Const.ADMINISTRATOR) {
          return this.getData(['userTeams']);
        } else {
          return this.getData(['teams']);
        }
      }
    },
    obj: {
      getData: function(obj, keys) {
        var k, tmpBulk, _i, _len;
        tmpBulk = obj;
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          k = keys[_i];
          if (tmpBulk[k] != null) {
            tmpBulk = tmpBulk[k];
          } else {
            helper["debugger"]('Error: parameter ' + k + ' in bulk is null');
            return null;
          }
        }
        return tmpBulk;
      }
    },
    "debugger": function(eventName, data) {
      if (Const.DEVELOP) {
        if (data) {
          console.log(eventName, data);
        } else {
          console.log(eventName, "No data");
        }
      }
    },
    number: {
      isNumber: function(num, min, max) {
        var out;
        out = parseInt(num);
        if (!out) {
          return false;
        }
        if (min === "") {
          min = Number.MIN_VALUE;
        }
        if (max === "") {
          max = Number.MAX_VALUE;
        }
        if (out > min || out < max) {
          return true;
        }
        return false;
      }
    }
  };

  module.exports = helper;

}).call(this);
