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
		},

		getDate: function(date) {
			var dateFormated = date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear();
			return dateFormated;
		},

        getDiffDate: function (date1, date2){ // number of days between two dates
            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
            firstDate = new Date(date1);
            secondDate = new Date(date2);
            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
            return diffDays;
        },

        //use in event
        dateValidate: function(){
            helper.format.getDateNow();
            if(event.currentTarget.value < time.toString || event.currentTarget.value > time.toString)
                event.currentTarget.value = time.toString;
        },
        getDateNow: function() {
            var time = new Date().toLocaleDateString().split(".");
            if (time[1].length == 1)
                time[1] = "0" + time[1];
            if (time[0].length == 1)
                time[0] = "0" + time[0];
            return {
                "year": time[2],
                "month": time[1],
                "day": time[0],
                "toString": time[2] + "-" + time[1] + "-" + time[0]
            };
        },

		getUniversalString: function(str) {
			var specChars = "áäčďéěíĺľňóô öŕšťúů üýřžÁÄČĎÉĚÍĹĽŇÓÔ ÖŔŠŤÚŮ ÜÝŘŽ";
			var univChars = "aacdeeillnoo orstuu uyrzAACDEEILLNOO ORSTUU UYRZ";
			
			output = "";

			for(var i = 0; i < str.length; i++) {
				if (specChars.indexOf(str.charAt(i)) != -1) {
					output += univChars.charAt(specChars.indexOf(str.charAt(i)));
				}
				else {
					output += str.charAt(i);
				}
			}

			return output; 
		}
	},

	dom: {
		//function for converting string into DOM element
		createElement: function(str) {
			var myElement = $(str);
			return myElement[0];
		},
        getParentByClass: function (el, className) {
            while (el && el.className !== className) {
                el = el.parentNode;
            }
            if(el)
                return el;
            return null;
        }
	},
	tpl:{
		create: function(name,params){
			var template = require("jade!../../js/"+name+".jade");

 		  return helper.dom.createElement(template(params));
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
	},
    number: {
        //Use for example isNumber(number,minimum,maximum), use isNumber(5,"","") if you don't need bounds.
        isNumber: function (num,min,max) {
            var out = parseInt(num);
            if(!out)
                return false;
            if( min == "")
                min = Number.MIN_VALUE;
            if( max == "")
                max = Number.MAX_VALUE;
            if(out > min || out < max)
                return true;
            return false;
        }
    }
}
