var App = function(){
	this.socket = io.connect();
}

App.prototype.getSumFromBackend = function(numbers){
	this.socket.emit('sum',numbers);
	this.socket.on('resp-sum', function(data){
		console.log(data);
	});
}


var First = function(number){
	this.number = number+number;
	this.type = 'first';
}

First.prototype.getType = function(){
	return this.type + ' ' + this.number;
}

First.prototype.sayHi = function(){
	console.log('hi');
	// alert('hi');
}

First.prototype.sayNo = function(){
	console.log('no');
}

var Second = function(number){
	this.super = First
	this.super.call(this, number);
	this.type = 'second';
}

Second.prototype = new First();
Second.prototype.constructor = Second;

Second.prototype.sayHi = function(){
	this.super.prototype.sayHi.apply(this, arguments);
	console.log('all');
}


var f = new First(10);
console.log(f.getType());
var s = new Second(15);
console.log(s.getType());
s.sayNo();
s.sayHi();