(function () {
    var express = require('express');
    var router = express.Router();
    
    router.prototype.isAuthenticated = function(req, res, next) {
        
        // do any checks you want to in here
        
        // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
        // you can do this however you want with whatever variables you set up
        var authenticated = true;
        if (authenticated) {
            console.log('logged in');
            return next();
        }
        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        res.redirect('/');
    }
    
    //TODO: proč to nejde?
    router.prototype.userValidation = function (){
        router.param('name', function (req, res, next, name) {
        // do validation on name here
        // blah blah validation
        // log something so we know its working
        console.log('doing name validations on ' + name);
        
        // once validation is done save the new item in the req
        req.name = name;
        // go to the next thing
        next();
        });
    }
    router.prototype.getPath = function(req) {

        var url = '#user?name=vladimir&surname=neckar';
        var map = [];
        var tmpUrl = url.split('?');
        //get parameters
        var params = tmpUrl.pop();
        var vars = params.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            map[pair[0]] = pair[1];
        }
        //get views
        var view = tmpUrl.pop().substring(1);
        return { view : view, parameters : map};
    }


    module.exports = router;
}).call(this);
