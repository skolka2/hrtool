var debug = require('debug')('hrtool:user-repository');
var parse = require('csv-parse');                                               //Coma separated values parser


module.exports = function(dbClient){

    return{
        /**
         * Register a new user. Insert him into table users
         * @param {object} userData - user data object
         * @param {function} next - callback function
         * @returns {undefined}
         */
        insertUser : function( userData, next){
            dbClient.insertOne('users', {
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                id_user_role: userData.id_user_role,
                id_buddy: userData.id_buddy
            }, next);
        },
        /**
         * Insert new rows to table users according to values in coma separated
         * values format. If some users already are in database, nothing will be
         * inserted.
         * @param {string} str - data in coma separated values format
         * @param {function} next - callback function
         * @returns {undefined}
         */
        insertUsersFromCSV : function(str, next){
            parse(str, function(err, rows){
                if(err)
                    return next(err, null);
                var values = [];
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    values.push({
                        first_name: row[0],
                        last_name: row[1],
                        email: row[2],
                        id_user_role: row[3],
                        id_buddy: row[4],
                    });
                }
                dbClient.insert('users', values, next);
            });
        },
        /**
         * Verify if user is registered
         * @param email - email of user
         * @param done - function which will serialize user. Important for google login.
         */
        getUser : function(email, done){
            dbClient.queryOne('SELECT * FROM users WHERE email=$1', [email],
                function(err, usr){
                    if(err)
                        return done(err);

                    if(!usr)
                        return done(null, false, {message : 'user is not registered'});
                    else
                        return done(null, usr);
                }
            );
        }



    };
};