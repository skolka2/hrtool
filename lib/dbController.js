var debug = require('debug')('hrtool:dbController');


module.exports = function(dbClient){
    
    return {
        /**
         * 
         * @param {type} req
         * @returns {undefined}
         */
        getAllTasks : function(req){
            dbClient.query("SELECT * FROM tasks", function(err, data){
                    if(err)
                        req.io.emit('task:getAll', {status : "error", error : err});
                    else
                        req.io.emit('task:getAll', {status : "ok", data : data});                
            });
        },
        /**
         * 
         * @param {type} userData
         * @param {type} req
         * @returns {undefined}
         */
        insertUser : function(userData, req){
            dbClient.query("INSERT INTO users VALUES ($1, $2, $3, $4, $5)", 
                [userData.first_name, userData.last_name, userData.email, userData.id_user_role, userData.id_buddy],
                function(err, req){
                    if(err)
                        req.io.emit('user:insert', {status : "error", error : err});
                    else
                        req.io.emit('user:insert', {status : "ok", error : null});
                }
            );
        }, 
        /**
         * 
         * @param {type} csv
         * @param {type} req
         * @returns {undefined}
         */
        insertUsersFromCSV: function(csv, req){
            
        }
    };
};