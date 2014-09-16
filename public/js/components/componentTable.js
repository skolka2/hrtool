var ComponentBase = require('./componentBase');


var ComponentTable =  module.exports =  function () {
	this.super.call(this);
    this.super = ComponentBase;
    this.data = null;

}

ComponentTable.prototype = new ComponentBase();
ComponentTable.prototype.constructor = ComponentTable;

ComponentTable.prototype.onLoad = function(data){
	this.element.innerHTML = "";
    this.data = data;
    



}

ComponentTable.prototype.sort = function(){


}

ComponentTable.prototype.sortByComlumn = function(column){


}



ComponentTable.prototype.loadMore = function(){

	
}

ComponentTable.EventType = {
    DATA_LOAD: 'tasks/user/list',
};