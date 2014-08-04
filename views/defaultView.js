(function(){
	var defaultView, baseView;
	var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
	
	baseView = require("./baseView.js");

	defaultView = (function(_super) {
	    __extends(viewUser, _super);

		function defaultView(){
			return baseView.__super__.constructor.apply(this, arguments);
		}

		defaultView.prototype.render = function(){
			baseView.__super__.render.apply(this, arguments);
			var mainWrapper = document.getElementById(this.mainWrapper);
			var div = document.createElement("div");
			div.id = "defaultView";
			div.innerText = "This is default view, you should not be seeing this (you should see other views instead).";
			mainWrapper.appendChild(div);
		};
		return defaultView;
	})(baseView);

}.call(this);