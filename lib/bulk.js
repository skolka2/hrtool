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
                    dbClient.queryAll("SELECT id_team, is_admin FROM users_teams WHERE id_user=$1", [user.id_user], function(err, data){
                        if(err) return next(err);

                        next(null, data);
                    });
                }
            }, function(err, res){
                if(err) return next(err);
                res.user = user;
                dbClient.queryAll("SELECT d.id_department, t.id_team FROM departments d JOIN teams t ON d.id_department=t.id_department", function(err, data){
                    if(err) {
                        debug('bulk error \n' + err);
                        return next(err);
                    }

                    res.map = {};
                    for(var i = 0; i < data.length; i++){
                        if(!res.map[data[i].id_department])
                            res.map[data[i].id_department] = [];
                        res.map[data[i].id_department].push(data[i].id_team);
                    }
                    debug('bulk ok');
                    next(null, res);
                });
            });
        }
    };
};





































