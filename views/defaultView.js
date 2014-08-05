
var defaultView, baseView;


//baseView = require("./baseView.js");
baseView = baseView;

defaultView = (function(_super) {

	function defaultView(){
		this.super = baseView;
		this.super.call(this,null);
	}

	defaultView.prototype.render = function(){
		this.super.prototype.render.apply(this, arguments);
		var mainWrapper = document.getElementById(baseView.mainWrapper);
		var div = document.createElement("div");
		div.id = "defaultView";
		div.innerText = "This is default view, you should not be seeing this (you should see other views instead).";
		mainWrapper.appendChild(div);
	};
	return defaultView;
})(baseView);
