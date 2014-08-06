var config = require('./config.json');                                          //configuration settings
var epg = require('easy-pg');
var dbClient = epg(config.conString);                                           //database client for sending queries
var express = require('express.io');
var app = express();
var router = require('./lib/router')(app);

app.http().io();
app.listen(config.port);
console.log('Server listens on port ' + config.port);

app.use(express.cookieParser());
app.use(express.session({secret: 'monkey'}));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

 















//SOCKETS EVENTS

//connected to database
dbClient.on('ready', function(){
    console.log('>> Successfully connected to database');
});

//disconnected from database
dbClient.on('end', function(){
    console.log('>> Successfully disconnected to database');
});

//database error
dbClient.on('error', function(err){
    console.log('>> Database client error:\n' + err);
});

//client was connected to the server
router.register('client connected', function(req, next) {
    next(null, 'ahoj');
    console.log('>> A client was connected');
});