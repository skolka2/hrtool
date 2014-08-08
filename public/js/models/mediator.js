
var Mediator =  function() {
	this.super = ObservableComponent;

}

Mediator.prototype = new ObservableComponent();
Mediator.prototype.constructor = mediator; 

/*
* @returns {object} singleton socket
*/
Mediator.prototype.getSocket = function() {
	if (mediator.socket == null) {
		mediator.socket = io.connect();
	}
	return mediator.socket;
};

/* call backend to retrieve data
* @param {object} callee 
* @param {string} endpoint
* @param {object} params parametres
* @param {type} type type of event
* @param {object} transform transformation of loaded data
*/
Mediator.prototype.loadData = function(callee, endpoint, params, type, transform){
	var self = this;
	this.getSocket().emit(endpoint, params, function( err) {	
		if (err != null) {
			console.log("error", err);
		}
	};

	this.getSocket().on(endpoint, params, function(data) {
		if (transform != null) {
			data = transform(data);
		}
		self.fire(type, data, callee);
	};
};





