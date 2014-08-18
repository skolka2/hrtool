var debug = require('debug')('hrtool:dbController');
var parse = require('csv-parse');                                               //Coma separated values parser

module.exports = function(dbClient){
    var insertUserQuery = "INSERT INTO users (first_name, last_name, email, id_user_role, id_buddy) VALUES ($1, $2, $3, $4, $5)";
    
    return {
        /**
         * Retrieve all tasks from table tasks and send this data to client
         * @param {function} next - callback function
         * @returns {undefined}
         */
        getAllTasks : function(next){
            dbClient.query("SELECT * FROM tasks AS t INNER JOIN departments AS d ON d.id_department = t.id_task INNER JOIN teams AS ts ON d.id_department = ts.id_department", function(err, data){
                 next(err, data.rows);
            });
        },
        /**
         * Register a new user. Insert him into table users
         * @param {object} userData - user data object
         * @param {function} next - callback function
         * @returns {undefined}
         */
        insertUser : function( userData, next){
            dbClient.query(insertUserQuery, 
                [userData.first_name, userData.last_name, userData.email, userData.id_user_role, userData.id_buddy],
                function(err, data){
                    next(err, data);
                }
            );
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
            parse(str, function(err, out){
                if(err){                    
                    next(err, null);
                }else{
                    var values = toUserObject(out);
                    dbClient.insert('users', values, function(err2, data2){
                        next(err2, data2);
                    });
                }
            });
        },
        /**
         * User data are sent to client
         * @param id - id of user you want
         * @param next - callback function
         */
        getUser: function(id, next){
            dbClient.queryOne("SELECT * FROM users WHERE id_user=$1", [id], function(err, data){
                next(err, data);
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
