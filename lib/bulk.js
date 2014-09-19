var async = require('async');
var debug = require('debug')('hrtool:bulk');


module.exports =  function(dbClient){
    return {
        createBulk: function(user, next){
            async.parallel({
                departments : function(next){
                    dbClient.queryAll("SELECT * FROM departments", function(err, rows){
                        if(err) return next(err);
                        var out = {};
                        for(var i = 0; i < rows.length; i++){
                            var row = rows[i];
                            out[row.id_department] = row;
                        }
                        next(null, out);

                    });
                },
                teams: function(next){
                    dbClient.queryAll("SELECT * FROM teams", function(err, rows){
                        if(err) return next(err);
                        var out = {};
                        for(var i = 0; i < rows.length; i++){
                            var row = rows[i];
                            out[row.id_team] = row;
                        }
                        next(null, out);

                    });
                },
                hrBuddy : function(next){
                    dbClient.queryOne("SELECT * FROM users WHERE id_user=$1", [user.id_buddy], function(err, data){
                        if(err)  return next(err);

                        next(null, data);
                    });
                },
                userTeams: function(next){
                    dbClient.queryAll("SELECT t.* FROM teams t\
                        JOIN users_teams ut ON ut.id_team=t.id_team\
                        JOIN users u ON u.id_user=ut.id_user WHERE u.id_user=$1 AND ut.is_admin=TRUE", [user.id_user], function(err, rows){
                        if(err) return next(err);
                        var out = {};
                        for(var i = 0; i < rows.length; i++){
                            var row = rows[i];
                            out[row.id_team] = row;
                        }
                        next(null, out);
                    });
                },
                userDepartments: function(next){
                    dbClient.queryAll("SELECT d.* FROM departments d\
                        JOIN teams t ON t.id_department=d.id_department\
                        JOIN users_teams ut ON ut.id_team=t.id_team\
                        JOIN users u ON u.id_user=ut.id_user WHERE u.id_user=$1", [user.id_user], function(err, rows) {
                        if (err) return next(err);
                        var out = {};
                        for (var i = 0; i < rows.length; i++) {
                            var row = rows[i];
                            out[row.id_department] = row;
                        }
                        next(null, out);

                    });
                },
                userRoles: function(next){
                    dbClient.queryAll("SELECT * FROM user_roles", function(err, data){
                        if(err) return next(err);

                        next(null, data);
                    });
                },
                departmentRoles: function(next){
                    dbClient.queryAll("SELECT * FROM department_roles", function(err, data){
                        if(err) return next(err);

                        next(null, data);
                    });
                }
            }, function(err, res){
                if(err){
                    debug('bulk err: \n' + err);
                    return next(err);
                }
                res.user = user;
                res.map = {};

                for(var i in res.departments){
                    var arr = [];
                    for(var j in res.teams){
                        if(res.teams[j].id_department === res.departments[i].id_department)
                            arr.push(res.teams[j].id_team);
                    }
                    res.map[res.departments[i].id_department] = arr;
                }

                debug('bulk ok');
                next(null, res);
            });
        }
    };
};





































