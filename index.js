var debug           = require('debug')('hrtool:index');                         //debug tool
var config          = require('./config.json');                                 //configuration settings
var epg             = require('easy-pg');
var dbClient        = epg(config.conString);                                    //database client for sending queries
var express         = require('express.io');
var app             = express();

app.http().io();
/*init middleware */
require('express.io-middleware')(app);
/* middleware adding multiroute functionality*/
app.io.use(function (req, next) {
    if(typeof req.session.passport.user ==="undefined"){
        debug("not logged in");
        //you are not register
         req.io.respond({error: "not logged in"});
    } else {
        next();
    }
});
var router          = require('./lib/router')(app);
var passport        = require('passport');
var GoogleStrategy  = require('passport-google').Strategy;
var bulk            = require('./lib/bulk')(dbClient);

var tasksRepository = require('./lib/repositories/tasks-repository')(dbClient);
require('./lib/routes/tasks-route')(router, tasksRepository );
var userRepository = require('./lib/repositories/user-repository')(dbClient);
require('./lib/routes/user-route')(router, userRepository);

app.use(express.cookieParser());
app.use(express.session({ secret: 'SBKS_hrtool' }));
app.use(passport.initialize());
app.use(express.static(__dirname + '/public'));


passport.serializeUser(function(user, done) {
    return done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
        returnURL: config.host + ':' + config.port + '/auth/google/return',
        realm: config.host + ':' + config.port + '/'
    },
    function(identifier, profile, done) {
        userRepository.verifyUser(profile.emails[0].value, done);
    }
));



//root of web aplication
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

//checks if user is logged in session and according to it sends error or default bulk data
app.get('/handshake', function (req, res, next) {
    if(!req.session.passport.user){
        return next('not logged in');
    }
    bulk.createBulk(req.session.passport.user, function(err, response){
        if(err) return next(err);
        res.json({data: response});
    });
});

app.use(function(err, req, res, next){
    if(err) return res.json({error: err});
});

//redirect to a google login formular
app.get('/auth/google', passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.
app.get('/auth/google/return',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
}));

//logout
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});



//database error
dbClient.on('error', function (err) {
    debug('>> Database error:\n' + err);
});


app.listen(config.port);
console.log('Server listens on port ' + config.port);