var debug = require('debug')('hrtool:router');


module.exports = function(app){
    var registredEndpoints = {};

    return {
        register : function(name, next){
            if(registredEndpoints[name]) {
                throw new Error('Endpoint ' + name + ' already exists !');
            }

            registredEndpoints[name] = true;
            app.io.route(name, function(req){
                debug('route begin - ' + name);
                next(req, function(err, data){
                    if(err){
                        debug('route error - ' + name + '\n', err);
                        return req.io.respond({error: err});
                    }
                    debug('route ok - ' + name + '\n');
                    req.io.respond({data: data});
                });
            });
        }
    };
};




