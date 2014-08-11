var helper;

//helper containing formating and other functions

helper = {
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
	}
}