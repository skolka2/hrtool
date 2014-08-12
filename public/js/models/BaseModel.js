/* ModelBase constructor */
var ModelBase =  function( ) {
	this.super = ObservableComponent;
	this.mediator = new Mediator();
}

ModelBase.prototype = new ObservableComponent();
ModelBase.prototype.constructor = ModelBase; 

/* loadData using medaitor 
* @param {object} callee 
* @param {string} endpoint
* @param {object} params parametres
* @param {type} type type of event
* @param {object} transform transformation of loaded data
*/
ModelBase.prototype.loadData = function(callee, endpoint, params, type, transform) {
	this.mediator.loadData(callee, endpoint, params, type, transform);
};





