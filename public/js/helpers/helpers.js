var helper;

//helper containing formating and other functions

helper = {
	formatFunctions: {
		//function for converting number (in parameter) to precentage representated by returning string
		getPercentage: function(num) {
			if(typeof num === 'number') {
				var result = (num * 100).toFixed(2)+"%";
				return result;
			}
			else {
				console.log("Not a number!")
			}
		}
	}

	elementsFunctions: {
		//function for converting string into DOM element
		getElement: function(str) {
			var myElement = $(str);
			return myElement[0];
		}
	}
}