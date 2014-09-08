var Const = require('./constants');
var app = require('../app');

//helper containing formating and other functions
var helper = module.exports = {
	format: {
		//function for converting number (in parameter) to precentage representated by returning string
		getPercentage: function(num) {
			if(!(isNaN(num))) {
				var result = (num * 100).toFixed(2)+"%";
				return result;
			}
			else {
				return ("Can't get the percentage, input is not a number!");
			}
		}
	},

	dom: {
		//function for converting string into DOM element
		createElement: function(str) {
			var myElement = $(str);
			return myElement[0];
		}
	},
	//helper.bulk.getData(['user','id_user'])
	bulk: {

		getData: function(keys){
			return helper.obj.getData(app.bulk, keys);
		}
	},
	obj: {
		getData: function(obj, keys){
			var tmpBulk = obj;
			for(var i = 0; i< keys.length; i++){
				if(tmpBulk[keys[i]] != null){
					tmpBulk = tmpBulk[keys[i]];
				}
				else {
					helper.debugger('Error: parameter ' + keys[i] + ' in bulk is null');

					return null;
				}
			}
			return tmpBulk;
		}
	},
	//helper.debugger('id', {data})
	debugger: function(eventName, data){
		if(Const.develop){
			if(data != null){
				console.log(eventName, data);
			}
			else{
				console.log(eventName, "No data");
			}
		}
	}

};
