(function() {

	var helper;

	//helper containing formating and other functions

	helper = {
		formatFunctions: {
			//function for converting number (in parameter) to precentage representated by returning string
			toPercentage: function(num) {
				if(typeof num === 'number') {
					var result;
					result = num.toFixed(2) + "%";
					return result;
				}
				else {
					console.log("Not a number!")
				}
			}
		}

		elementsFunctions: {
			//function for converting string into DOM element
			fromStringToElement: function(str) {
				var myElement = $(str);
				return myElement[0];
			}
		}
	}
	
}).call(this);