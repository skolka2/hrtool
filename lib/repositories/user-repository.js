var debug = require('debug')('hrtool:user-repository');
var parse = require('csv-parse');
var _ = require('lodash-node');
var async = require('async');


module.exports = function(dbClient){

    return{
        /**
         * Register a new user. Insert him into table users
         * @param {object} userData - user data object
         * @param {function} next - callback function
         * @returns {undefined}
         */
        insertUser : function(userData, next){
            var data1 = _.pick(userData, ['first_name', 'last_name', 'email', 'is_hr', 'id_department_role', 'id_buddy']);
            data1.started_at = new Date().toDateString();
            var data2 = _.pick(userData, ['is_admin', 'id_team']);
            async.waterfall([
                function(callback) {
                    var title = userData.is_admin ? 'Team manager' : 'User';
                    dbClient.queryOne("SELECT id_user_role FROM user_roles WHERE title=$1", [title], callback);
                },
                function(res, callback){
                    data1.id_user_role = res.id_user_role;
                    dbClient.insertOne('users', data1, callback);
                },
                function(res, callback){
                    data2.id_user = res.id_user;
                    dbClient.insertOne('users_teams', data2, callback);
                }
            ], next);
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
                        started_at: row[3],
                        id_user_role: row[4],
                        id_department_role: row[5],
                        id_buddy: row[6]
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
        verifyUser : function(email, done){
            dbClient.queryOne('SELECT * FROM users WHERE email=$1', [email], done);
        },
        /**
         * Returns all records in table users
         * @param userIdRole - id user role of logged user
         * @param next - callback function
         */
        getAllUsers : function(userIdRole, next){
            dbClient.queryAll("SELECT id_user_role FROM user_roles \
                WHERE id_user_role=$1 AND (title='Administrator' OR title='Team manager')" , [userIdRole], function(err, data){
                if(err) return next(err);

                if(data.length > 0) {   //logged user has rights to get data
                    dbClient.queryAll("SELECT u.*, ut.id_team, t.id_department, CONCAT(u.last_name,', ',u.first_name) AS full_name \
                                       FROM users u\
                                       JOIN users_teams ut ON u.id_user=ut.id_user\
                                       JOIN teams t ON ut.id_team=t.id_team", next);
                }else
                    next('Not authorized to do that');
            });
        },

        /**
         * Selests HRs
         * @param next - callback function
        */
        getHR : function(email, next){
            dbClient.queryAll('SELECT id_user, first_name,last_name FROM users WHERE is_hr ORDER BY last_name', next);
        }
        


    };
};