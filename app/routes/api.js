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


        if (req.body.username == null || req.body.username == '' || req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '' ||
            req.body.name == null || req.body.name == '' || req.body.age == null || req.body.age == '' || req.body.gender == null || req.body.gender == '' ||
            req.body.bloodGroup == null || req.body.bloodGroup == '' || req.body.weight == null || req.body.weight == '' ||
            req.body.mobileNumber == null || req.body.mobileNumber == '') {
            res.json({ success: false, message: 'Ensure entered data' });
        } else {
            user.save(function (err) {
                if (err) {
                    if (err.errors != null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message });
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message });
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message });
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        } else if (err.errors.age) {
                            res.json({ success: false, message: err.errors.age.message });
                        } else if (err.errors.gender) {
                            res.json({ success: false, message: err.errors.gender.message });
                        } else if (err.errors.bloodGroup) {
                            res.json({ success: false, message: err.errors.bloodGroup.message });
                        } else if (err.errors.resPhoneNumber) {
                            res.json({ success: false, message: err.errors.resPhoneNumber.message });
                        } else if (err.errors.mobileNumber) {
                            res.json({ success: false, message: err.errors.mobileNumber.message });
                        } else if (err.errors.address) {
                            res.json({ success: false, message: err.errors.address.message });
                        } else if (err.errors.weight) {
                            res.json({ success: false, message: err.errors.weight.message });
                        }
                    } else if (err) {
                        // Check if duplication error exists
                        if (err.code == 11000) {
                            if (err.errmsg[61] == "u") {
                                res.json({ success: false, message: 'That username is already taken' }); // Display error if username already taken
                            } else if (err.errmsg[61] == "e") {
                                res.json({ success: false, message: 'That e-mail is already taken' }); // Display error if e-mail already taken
                            }
                        } else {
                            res.json({ success: false, message: err }); // Display any other error
                        }
                    }
                }
                else {
                    res.json({ success: true, message: "User created" });
                }
            });

        }
    });
    return router;
}