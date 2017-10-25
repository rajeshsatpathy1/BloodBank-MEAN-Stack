var express     = require('express');
var app         = express();
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var User        = require('./app/models/user'); //Contains the user model - user.js
var PORT        = process.env.port || 8880;
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken');  //To keep the user logged in
var passport    = require('passport')
var social      = require('./public/app/passport/passport')(app, passport);

var secret      = 'NCrypTed';   //Secret for JSON web token

//app.use(morgan('dev'));
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); //set public as root folder

mongoose.connect('mongodb://localhost:27017/tutorial5',{ useMongoClient: true },function(err){
    if(err){
        console.log('Unsuccesful attempt');
    }
    else
        console.log('Successfully connected');
});

/*app.get('/', function(req, res) {
	res.render('index');
});*/

app.get('*/', function(req, res) {
	res.render('bootstrap');    //Root file for all navigations
});

app.post('/users',jsonParser,function(req,res){ //Posted through public/pages/register.html controlled by userCtrl.js
    var user = new User({
        "userName"  : req.body.username,
        "password"  : req.body.password,
        "email"     : req.body.email,
        "name"      : req.body.name
    });
    //console.log("this is the alternate" + req.body.username);
    if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == ''|| req.body.name == null || req.body.name == ''){
        res.json({success: false, message: 'Name, Username, password or email not entered.'});
    }else{
    user.save(function(err){
        if(err){
            if(err.errors != null){
                if(err.errors.name){
                    res.json({success: false, message: err.errors.name.message});
                }else if(err.errors.email){
                    res.json({success: false, message: err.errors.email.message});
                }else if(err.errors.username){
                    res.json({success: false, message: err.errors.username.message});
                }else if(err.errors.password){
                    res.json({success: false, message: err.errors.password.message});
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
        else{
            res.json({success: true, message: "User created"});
        }
    });
    }
});

app.post('/checkusername', jsonParser, function(req, res){
    User.findOne({username: req.body.username }).select('username').exec(function(req, res){
        if(user){
            res.json({success: false, message: 'That username is already taken'});
        }else{
            res.json({success: true, message: 'Valid username'});
        }
    });
});

app.post('/checkemail', jsonParser, function(req, res){
    User.findOne({email: req.body.email }).select('email').exec(function(req, res){
        if(user){
            res.json({success: false, message: 'Somebody is already using that email address'});
        }else{
            res.json({success: true, message: 'Valid email'});
        }
    });
});

app.post('/authenticate',jsonParser, function(req, res){    //on public/pages/login.html controlled by mainCtrl.js
    User.findOne({ userName: req.body.username }).select('email username password').exec(function(err, user){
        if(err)  console.log(err);
        //console.log('This is  ' + req.body.username + ' with password: ' + req.body.password); //Check for working condition
        if(!user){
            res.json({success: false, message: 'Could not authenticate user'});
        }else if(user){
            if(!req.body.password){
                res.json({ success: false, message: 'Password field is empty' });
            }else{
                var validPass = user.comparePassword(req.body.password);
                if(!validPass){
                    res.json({ success: false, message: '!Password mismatch to the username given!'});
                }
                else{
                    //After authentication create token
                    token = jwt.sign({
                        username: req.body.username, email: user.email  //Some error right here on user.username so using req.body.username
                    }, secret, {expiresIn: '24h'});
                    res.json({success: true, message: 'User Authenticated!', token: token});
            }
        }
        }
    });
});

// Middleware for Routes that checks for token - Place all routes after this route that require the user to already be logged in
app.use(jsonParser, function(req, res, next) {
console.log(req.headers['x-access-token']);
var token = req.body.token || req.body.query || req.headers['x-access-token'];
// Check if token is valid and not expired  
if (token) {
    // Function to verify token
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            res.json({ success: false, message: 'Token invalid' }); // Token has expired or is invalid
        } else {
            req.decoded = decoded; // Assign to req. variable to be able to use it in next() route ('/me' route)
            next(); // Required to leave middleware
        }
    });
} else {
    res.json({ success: false, message: 'No token provided' }); // Return error if no token was provided in the request
}
});

// Route to get the currently logged in user    
app.post('/me', function(req, res) {    //Post to check if token has saved the right thing - Use Postman(REST api)
    res.send(req.decoded); // Return the token acquired from middleware
});

app.listen(PORT,function(){
    console.log('Server running at port ' + PORT);
});
