var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

	socket.on('sum', function (data) {
		sum = 0;
		for (var i = 0; i < data.length; i++) sum += data[i]
		socket.emit('sum', sum);
	});

});

var port = 8080;
server.listen(port);
console.log('Server listens on ' + port)
