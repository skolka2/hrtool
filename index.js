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
app.use(express.session({ secret: 'monkey' }));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});