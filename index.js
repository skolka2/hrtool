var config = require('./config.json');                                          //configuration settings
var epg = require('easy-pg');
var dbClient = epg(config.conString);                                           //database client for sending queries
var express = require('express.io');
var app = express();
var router = require('./lib/router')(app);

app.http().io();
app.listen(config.port);
console.log('Server listens on port ' + config.port);
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.cookieParser());
app.use(express.session({ secret: 'monkey' }));
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

