var Base = function(){
	this.socket = io.connect();
}

Base.prototype.getSumFromBackend = function(numbers){
	this.socket.emit('sum',numbers);
	this.socket.on('resp-sum', function(data){
		console.log(data);
	});

}