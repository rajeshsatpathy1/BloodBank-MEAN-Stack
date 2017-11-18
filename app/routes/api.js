var User = require('../models/user');//USER MODAL
var Request = require('../models/request');//REQUEST MODAL
var jwt = require('jsonwebtoken');//FOR CREATING TOKEN
var secret = 'lokijuhygt';//ENCRYPTION OF TOKEN
var loginDuration = '30m';//FOR HOW MUCH TIME THE USER SHOULD BE LOGGED IN

module.exports = function (router) {

    //USER REGISTRATION ROUTE
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        //user.fullName = user.firstName+' '+user.lastName;

        user.email = req.body.email;
        var mobile_Number = req.body.mobileNumber;
        user.mobileNumber = mobile_Number.slice(mobile_Number.length - 10, mobile_Number.length);

        user.date = req.body.date;

        var today = new Date();
        var birthDate = new Date(user.date);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        };

        user.gender = req.body.gender;
        user.bloodGroup = req.body.bloodGroup;
        user.weight = req.body.weight;


        if (req.body.username == null || req.body.username == '' || req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '' ||
            req.body.lastName == null || req.body.lastName == '' || req.body.firstName == null || req.body.firstName == '' || req.body.date == null || req.body.date == '' || req.body.gender == null || req.body.gender == '' ||
            req.body.bloodGroup == null || req.body.bloodGroup == '' || req.body.weight == null || req.body.weight == '' ||
            req.body.mobileNumber == null || req.body.mobileNumber == '') {
            res.json({ success: false, message: 'Ensure that you entered all data correctly.' });
        } else if (age < 0) {
            res.json({ success: false, message: "Date can't be more than today's Date." });
        } else if (age < 18 || age > 60) {
            res.json({ success: false, message: "Your age must be between 18-60 for registration." });
        } else {
            user.save(function (err) {
                if (err) {
                    //res.json({ success: false, message: err }); // Display any other error
                    //console.log(err.code);
                    if (err.code === 11000) {
                        if (err.errmsg[55] === "u")
                            res.json({ success: false, message: "Username already used." });
                        else if (err.errmsg[55] === "e") {
                            res.json({ success: false, message: "Email already used." });
                        } else if (err.errmsg[55] === "m") {
                            res.json({ success: false, message: "Mobile number already used." });
                        } else {
                            res.json({ success: false, message: err });
                        }
                    } else if (err.message[24] === "u") {
                        res.json({ success: false, message: "Ensure that username entered doesn't have special character and has length between 3-30." });
                    } else if (err.message[24] === "f") {
                        res.json({ success: false, message: "Ensure that first name entered doesn't have numbers or special character and has minimum length of 3-30." });
                    } else if (err.message[24] === "l") {
                        res.json({ success: false, message: "Ensure that last name entered doesn't have numbers or special character and has minimum length of 3-30." });
                    } else if (err.message[24] === "m") {
                        res.json({ success: false, message: "Ensure that mobile number entered is correct." });
                    } else if (err.message[24] === "d") {
                        res.json({ success: false, message: "Ensure the date is correct." });
                    } else if (err.message[24] === "w") {
                        res.json({ success: false, message: "Your weight must be between 30-150 for registration." });
                    } else if (err.message[24] === "g") {
                        res.json({ success: false, message: "Enter the valid gender." });
                    } else if (err.message[24] === "b") {
                        res.json({ success: false, message: "Select the valid blood group." });
                    } else if (err.message[24] === "a") {
                        res.json({ success: false, message: "Your age must be between 18-60 for registration." });
                    } else if (err.message[24] === "p") {
                        res.json({ success: false, message: "Password must contain at least one lower case, one upper case, one number, one special character and length must be between 3-30." });
                    } else {
                        res.json({ success: false, message: "unhandled." });
                    }
                    //else{res.json({success: false, message: err});
                    //console.log(err.errmsg);}
                    //console.log(err.message);
                } else {
                    res.json({ success: true, message: "User Created" });
                }
            });
        }
    });

    //CHECK USERNAME
    router.post('/checkusername', function (req, res) {
        User.findOne({ username: req.body.username }).select('username').exec(function (err, user) {
            if (err) throw err;

            if (user) {
                res.json({ success: false, message: 'username already taken' });
            } else {
                res.json({ success: true, message: 'valid username' });
            }
        });
    });

    //CHECK EMAIL
    router.post('/checkemail', function (req, res) {
        User.findOne({ email: req.body.email }).select('email').exec(function (err, user) {
            if (err) throw err;

            if (user) {
                res.json({ success: false, message: 'e-mail already taken' });
            } else {
                res.json({ success: true, message: 'valid email' });
            }
        });
    });

    //CHECK MOBILE NUMBER
    router.post('/checkmobilenumber', function (req, res) {
        //console.log(req.body.mobileNumber);
        var mobile_Number = req.body.mobileNumber;
        if (mobile_Number) {
            mobile_Number = mobile_Number.slice(mobile_Number.length - 10, mobile_Number.length);
            //console.log(mobile_Number);
            User.findOne({ mobileNumber: mobile_Number }).select('mobileNumber').exec(function (err, user) {
                if (err) throw err;

                if (user) {
                    res.json({ success: false, message: 'mobile number already taken' });
                } else {
                    res.json({ success: true, message: 'valid mobile number' });
                }
            });
        } else {
            res.json({ success: false, message: 'eror checking' });
        }
    });

    //USER LOGIN ROUTE
    router.post('/authenticate', function (req, res) {
        User.findOne({ username: req.body.username }).select('email username password').exec(function (err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Could not authenticate user.' })
            } else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                }
                else {
                    res.json({ success: false, message: 'No password provided.' });
                }
                if (!validPassword) {
                    res.json({ success: false, message: 'Could not authenticate password.' });
                } else {
                    var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: loginDuration });
                    res.json({ success: true, message: 'User Authenticated!', token: token });
                }
            }
        });
    });

    //RECIPIENT REQUESTS ROUTE
    router.post('/requests', function (req, res) {
        var request = new Request();
        var today = new Date();
        console.log(req.body);
        request.bloodGroup = req.body.bloodGroup;
        request.contactEmail = req.body.contactEmail;
        var contact_Number = req.body.contactNumber;
        request.contactNumber = contact_Number.slice(contact_Number.length - 10, contact_Number.length);
        request.contactName = req.body.contactName;
        request.patientName = req.body.patientName;
        request.date = today;
        request.bloodUnit = req.body.bloodUnit;

        if (req.body.bloodGroup == null || req.body.bloodGroup == '' || req.body.contactEmail == null || req.body.contactEmail == '' || req.body.patientName == null || req.body.patientName == '' ||
            req.body.contactNumber == null || req.body.contactNumber == '' || req.body.contactName == null || req.body.contactName == '') {
            res.json({ success: false, message: 'Ensure that you entered all data correctly.' });
        } else {
            request.save(function (err) {
                if (err) {
                    //res.json({ success: false, message: err }); // Display any other error
                    //console.log(err.code);
                    if (err.message[35] === "u") {
                        res.json({ success: false, message: "Ensure that mobile number entered is correct." });
                    } else if (err.message[34] === "E") {
                        res.json({ success: false, message: "Ensure that email is correct. " });
                    } else if (err.message[27] === "c" && err.message[35] === "a") {
                        res.json({ success: false, message: "Ensure that Contact name entered doesn't have numbers or special character and has length between 3-30." });
                    } else if (err.message[27] === "p") {
                        res.json({ success: false, message: "Ensure that Patient name entered doesn't have numbers or special character and has length between 3-30." });
                    } else if (err.message[27] === "b") {
                        res.json({ success: false, message: "Select the valid blood group." });
                    } else {
                        res.json({ success: false, message: "unhandled." });
                    }
                    //else{res.json({success: false, message: err});
                    //console.log(err.errmsg);}
                    console.log(err.message);
                } else {
                    res.json({ success: true, message: "Request Sent" });
                }
            });
        }

    });

    //MIDDLEWARE TO CHECK IF LOGGED IN FOR BELOW THINGS
    router.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided' });
        }
    });

    router.post('/me', function (req, res) {
        res.send(req.decoded);
    });

    //RENEW USER TOKEN
    router.get('/renewToken/:username', function (req, res) {
        User.findOne({ username: req.params.username }).select().exec(function (err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'No user was found' });
            } else {
                var newToken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: loginDuration });
                res.json({ success: true, token: newToken });
            }
        });
    });

    router.get('/permission', function(req, res){
        User.findOne({ username: req.decoded.username }, function(err, user){
            if (err) throw err;
            if(!user){
                res.json({ success: false, message: 'No user found' });
            }else{
                res.json({ success: true, userType: user.userType });
            }
        })
    });

    router.get('/management', function(req, res){
        User.find({}, function(err, users){
            if(err) throw err;
            User.findOne({ username: req.decoded.username }, function(err, mainUser){
                if(err) throw err;
                if(!mainUser){
                    //console.log(users);
                    res.json({ success: false, message: "No main user found"}); //Just for security purposes
                }else{
                   // console.log(users);
                    if(mainUser.userType === 'admin' || mainUser.userType === 'moderator'){
                        if(!users){
                            res.json({ success:false, message: "No users found" });
                        }else{
                            res.json({ success: true, users: users, userType: mainUser.userType});
                        }
                    }else{
                        res.json({ success: false, message: "Insufficient permissions"});
                    }
                }
            })
        });
    });

    router.delete('/management/:username',function(req,res){
        var deletedUsername = req.params.username;
        User.findOne({ username: req.decoded.username }, function(err, mainUser){
            if(err) throw err;
            if(!mainUser){
                res.json({ success: false, message: "no user found"}); // Just for confirmation
            }else{
                if(mainUser.userType !== "admin"){
                    res.json({ success: false, message: "access permissions insufficient"});
                }else{
                    User.findOneAndRemove({ username: deletedUsername }, function(err, user){
                        if(err) throw err;
                        res.json({ success: true });
                    });
                }
            }
    
        });
    });

    return router;
}