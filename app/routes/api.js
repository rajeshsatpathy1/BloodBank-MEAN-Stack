var User = require('../models/user');

module.exports = function (router) {
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.name = req.body.name;
        user.password = req.body.password;
        user.email = req.body.email;

        user.age = req.body.age;
        user.gender = req.body.gender;
        user.bloodGroup = req.body.bloodGroup;
        user.weight = req.body.weight;

        user.resPhoneNumber = req.body.resPhoneNumber;
        user.mobileNumber = req.body.mobileNumber;
        var i = 0;

        if (req.body.username == null || req.body.username == '' || req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '' ||
            req.body.name == null || req.body.name == '' || req.body.age == null || req.body.age == '' || req.body.gender == null || req.body.gender == '' ||
            req.body.bloodGroup == null || req.body.bloodGroup == '' || req.body.weight == null || req.body.weight == '' ||
            req.body.mobileNumber == null || req.body.mobileNumber == '') {
            res.json({ success: false, message: 'Ensure all the fields are entered' });
        } else {
            user.save(function (err) {
                if (err) {
                        //res.json({ success: false, message: err }); // Display any other error
                        //console.log(err.code);
                        if(err.code === 11000){
                            if(err.errmsg[55] === "u")
                                res.json({success: false, message: "Username already used"});
                            else if(err.errmsg[55] === "e"){
                                res.json({success: false, message: "Email already used"});
                            }else{
                                res.json({success: false, message: err});
                            }
                        }
                        //console.log(err.errmsg[55]);      
                }
                else {
                    res.json({ success: true, message: "User created" });
                }
            });

        }
    });
    return router;
}