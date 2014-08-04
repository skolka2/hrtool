(function() {

	var Observer = require('./observer');

	var mediator =  function( super ) {
		mediator.prototype = super;
		mediator.prototype.constructor = mediator;
		
		function mediator(){
			this.socket = this.getSocket();
		}

		mediator.prototype.getSocket = function() {
			if (mediator.socket == null) {
				mediator.socket = io.connect();
			}
			return mediator.socket;
		};


		mediator.prototype.loadData = function(callee, endpoint, params, type, transform){

			this.socket.on(endpoint, params, (function(_this) {
				return function(data) {
					if (transform != null) {
						data = transform(data);
					}
					_this.fire(type, data, callee);
				};
			})(this));

		}

		return mediator;
	})(Observer);







}).call(this);