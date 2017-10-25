/**Not using this one */
var User        = require('../models/user');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


module.exports = function(router){
    router.post('/users',urlencodedParser,function(req,res){
        var user = new User({
            "userName": req.body.username,
            "password": req.body.password,
            "email": req.body.email
        });
        console.log("this is the" + req.body.username);
        user.save(function(err){
            if(err) throw err; 
            console.log("person saved");
        });
        res.send("User saved");
    });
    return router;
}