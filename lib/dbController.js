var debug = require('debug')('hrtool:dbController');
var parse = require('csv-parse');                                               //Coma separated values parser

module.exports = function(dbClient){
    var insertUserQuery = "INSERT INTO users (first_name, last_name, email, id_user_role, id_buddy) VALUES ($1, $2, $3, $4, $5)";
    
    return {
        /**
         * Retrieve all tasks from table tasks and send this data to klient
         * @param {object} req - object for responce (socket info included)
         * @returns {undefined}
         */
        getAllTasks : function(req){
            dbClient.query("SELECT * FROM tasks", function(err, data){
                    if(err){                       
                        req.io.respond({status : "error", error : err});
                        debug('getAllTasks - error: \n' + err);
                    }else{
                        req.io.respond({status : "ok", data : data.rows}); 
                        debug('getAllTasks - ok:');
                    }
            });
        },
        /**
         * Register a new user. Insert him into table users
         * @param {object} req - object for responce (socket info included)
         * @param {type} userData
         * @returns {undefined}
         */
        insertUser : function(req, userData){
            dbClient.query(insertUserQuery, 
                [userData.first_name, userData.last_name, userData.email, userData.id_user_role, userData.id_buddy],
                function(err, req){
                    if(err){
                        req.io.respond({status : "error", error : err});
                        debug('insertUser - err:\n' + err);
                    }else{
                        req.io.respond({status : "ok", error : null});
                        debug('insertUser - ok');
                    }
                }
            );
        }, 
        /**
         * Insert new rows to table users according to values in coma separated
         * values format. If some users already are in database, nothing will be
         * inserted and response with status 'database error' will be returned.
         * Status will be 'ok' otherwise.
         * @param {object} req - object for response (socket info included)
         * @param {string} str - data in coma separated values format 
         * @returns {undefined}
         */
        insertUsersFromCSV : function(req, str){
            var duplicit = false;
            parse(str, function(err, out){
                if(err){                    
                    debug('insertUsersFromCSV - parsing csv error:\n' + err);
                    req.io.respond({status : "parsing error", error : err});
                }else{
                    debug('insertUsersFromCSV - parsing ok:');
                    var values = toUserObject(out);
                    dbClient.insert('users', values, function(err2){
                        if(err2){
                            req.io.respond({status : "database error", error : err2});
                            debug('insertUsersFromCSV - database error:\n' + err2);                            
                        }else{
                            req.io.respond({status : "ok"});
                            debug('insertUsersFromCSV - ok:\n');       
                        }
                    });
                }
            });
        }
        
        
        
        
        
        
        
        
        
    };
};



/**
 * Convert an array of arrays to arrays of objects. Each has equal structure to 
 * record in table users
 * @param {array} arr - converting array of arrays
 * @returns {Object} - converted array of arrays to array of user objects 
 */
function toUserObject(arr){
    var result = [];
    for(var i in arr){
        var obj = {};
        obj.first_name = arr[i][0];
        obj.last_name = arr[i][1];
        obj.email = arr[i][2];
        obj.id_user_role = arr[i][3];
        obj.id_buddy = arr[i][4];
        result.push(obj);
    }
    return result;
}
