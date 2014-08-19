var debug = require('debug')('hrtool:user-route');

module.exports = function(router, userRepository){
    //A new user is inserted to database
    router.register('user/insert', function(req, next){
        userRepository.insertUser(req.data, next);
    });

    //A new users are inserted to database from coma separated value format
    router.register('user/insert-from-csv', function(req, next){
        userRepository.insertUsersFromCSV(req.data, next);
    });

};