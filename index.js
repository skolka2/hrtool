var config = require('./config.json');                                          //configuration settings

(function(){
    var epg = require('easy-pg');
    var dbClient = epg(config.conString);                                       //database client for sending queries
    var express = require('express.io');
    var app = express();

    app.http().io();
    app.listen(config.port);
    console.log('Server listens on port ' + config.port);

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
    app.io.route('client connected', function(req) {
        req.io.respond(true);
        console.log('>> A client was connected');
    });
    
})();