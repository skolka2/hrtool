var debug           = require('debug')('hrtool:index');                         //debug tool
var config          = require('./config.json');                                 //configuration settings
var epg             = require('easy-pg');
var dbClient        = epg(config.conString);                                    //database client for sending queries
var express         = require('express.io');
var app             = express();
app.http().io();
require('express.io-middleware')(app);
var router          = require('./lib/router')(app);
var passport        = require('passport');
var GoogleStrategy  = require('passport-google').Strategy;
var tasksRepository = require('./lib/repositories/tasks-repository')(dbClient);
require('./lib/routes/tasks-route')(router, tasksRepository );


app.use(express.cookieParser());
app.use(express.session({secret: 'SBKS_hrtool'}));
app.use(passport.initialize());
app.use(express.static(__dirname + '/public'));
/*
router.register(function (req, next) {
      console.log(req);
    if(req.session.passport.user ===undefined){
        //you are not register
        console.log('you are not logged in');
    } else {
        next();
    }
});
*/
passport.serializeUser(function(user, done) {
    return done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    returnURL: config.host + ':' + config.port + '/auth/google/return',
    realm: config.host + ':' + config.port + '/'
},
        function(identifier, profile, done) {                                   //finds a user in database if registred
            dbClient.queryOne('SELECT * FROM users WHERE email=$1', [profile.emails[0].value.toString()], 
                function(err, user){
                    if(err){              
                        debug('google login: database error: ' + err);
                        return done(err);
                    }
                    if(user){                                   
                        //user is registred
                        debug('google login: ' + profile.emails[0].value + ' is logged in\n');
                        return done(null, user);
                    }else{
                        //user is not registred
                        debug('google login: ' + profile.emails[0].value + ' is NOT registred and therefore cannot be logged in\n');
                        return done(null, false, { message: 'This user is not registred!' });
                    }
                }
                );
        }
        ));





//ENDPOINTS

//root of web aplication
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

//checks if user is logged in session and acording to it sends proper redirect url
app.get('/handshake', function (req, res) {
    if(!req.session.passport.user){
        res.json({error: 'not logged in'});
    }else{
        res.json({user: req.session.passport.user});
    }
});






//redirect to a google login formular
app.get('/auth/google', passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.  
app.get('/auth/google/return', 
  passport.authenticate('google', { successRedirect: '/',
    failureRedirect: '/' }));



//database error
dbClient.on('error', function(err){
    debug('>> Database error:\n' + err);
});






app.listen(config.port);
console.log('Server listens on port ' + config.port);
