var debug           = require('debug')('hrtool:index');                         //debug tool
var config          = require('./config.json');                                 //configuration settings
var epg             = require('easy-pg');
var dbClient        = epg(config.conString);                                    //database client for sending queries
var express         = require('express.io');
var app             = express();
var router          = require('./lib/router')(app);
var passport        = require('passport');
var GoogleStrategy  = require('passport-google').Strategy;
var dbController    = require('./lib/repositories/dbController')(dbClient);
var bulk = {};

app.use(express.cookieParser());
app.use(express.session({ secret: 'SBKS_hrtool' }));
app.use(passport.initialize());
app.use(express.static(__dirname + '/public'));


app.http().io();
app.listen(config.port);
console.log('Server listens on port ' + config.port);


passport.serializeUser(function (user, done) {
    return done(null, user);
});

passport.deserializeUser(function (obj, done) {
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


//Preparing default structure of bulk data which will be sent to each logged client
bulk.departments = [];
bulk.teams = {};
bulk.map = {};
dbClient.queryAll("SELECT * FROM departments", function(err, data){
    if(!err){
        bulk.departments = data;
        for(var i in data){
            bulk.map[data[i].id_department] = [];
            dbClient.queryAll("SELECT * FROM teams WHERE id_department=$1", [data[i].id_department], function(err2, data2){
                if(!err2){
                    for(var j in data2){
                        bulk.map[data2[0].id_department].push(data2[j].id_team);
                    }
                }else
                    debug('handshake: bulk error\n' + err);
            });
        }
    }else
        debug('handshake: bulk error\n' + err);
});
dbClient.queryAll("SELECT * FROM teams", function(err, data){
    if(!err){
        for(var i in data){
            bulk.teams[data[i].id_team] = data[i];
            delete bulk.teams[data[i].id_team].id_team; //id_team is key so there is no need to have it
        }
    }else
        debug('handshake: bulk error\n' + err);
});



//ENDPOINTS

//root of web aplication
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

//checks if user is logged in session and according to it sends error or default bulk data
app.get('/handshake', function (req, res) {
    if(!req.session.passport.user){
        res.json({error: 'not logged in'});
    }else{
        bulk.user = req.session.passport.user;
        dbClient.queryOne("SELECT * FROM users WHERE id_user=$1", [req.session.passport.user.id_buddy], function(err, data){
            if(!err){
                bulk.hrBuddy = data;
                dbClient.queryAll("SELECT id_team, is_admin FROM users_teams WHERE id_user=$1",
                        [req.session.passport.user.id_user], function(err2, data2){
                    if(!err2) {
                        bulk.userTeams = data2;
                        res.json(bulk);
                        debug('handshake: bulk ok');
                        console.log(bulk);
                    }else
                        debug('handshake: bulk error\n' + err);
                });
            }else
                debug('handshake: bulk error\n' + err);
        });
    }
});



//redirect to a google login formular
app.get('/auth/google', passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.  
app.get('/auth/google/return', 
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
}));



//ROUTES

//All saved tasks will be sent to klient
router.register('task:getAll', function (req) {
    dbController.getAllTasks(req);
});

//A new user is inserted to database
router.register('user:insert', function (req) {
    dbController.insertUser(req, req.data);
});

//A new users are inserted to database from coma separated value format
router.register('user:insertFromCSV', function (req, next) {
    dbController.insertUsersFromCSV(req, req.data);
});









//database error
dbClient.on('error', function (err) {
    debug('>> Database error:\n' + err);
});
