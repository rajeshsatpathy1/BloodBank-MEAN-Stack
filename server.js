var express     = require('express');
var app         = express();
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var User        = require('./app/models/user');
var PORT        = process.env.port || 8080;
var bodyParser = require('body-parser');

app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

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

app.get('/*', function(req, res) {
	res.render('bootstrap');
});

app.post('/users',jsonParser,function(req,res){
    var user = new User({
        "userName": req.body.username,
        "password": req.body.password,
        "email": req.body.email
    });
    //console.log("this is the alternate" + req.body.username);
    if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == ''){
        res.json({success: false, message: 'Username, password or email not entered.'});
    }else{
    user.save(function(err){
        if(err){
            res.json({success: false, message: "Username or email already exists"});
        } 
        else{
            res.json({success: true, message: "User created"});
        }
    });
    }
});

app.post('/authenticate',jsonParser, function(req, res){
    User.findOne({ userName: req.body.username }).select('email username password').exec(function(err, user){
        if(err)  console.log(err);
        console.log('This is  ' + req.body.username + ' with password: ' + req.body.password); //Check for working condition*/
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
                    res.json({success: true, message: 'User Authenticated.'});
            }
        }
        }
    });
});

app.listen(PORT,function(){
    console.log('Server running at port ' + PORT);
});
