var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    username:{type: String, lowercase:true, required:true, unique:true},
    name:{type: String, required:true},
    password:{type: String, required:true},
    email:{type:String, required:true, lowercase:true, unique:true},

    age:{type:Number, required:true, min:1, max:100},
    gender:{type:String, required:true, possibleValues: ['M','F']},
    bloodGroup:{type:String, required:true, possibleValues: ['A+','B+','O+','A-','B-','O-','AB+','AB-']},
    weight:{type:Number, required:true, min:3, max:150},
    
    resPhoneNumber:{type:Number},
    mobileNumber:{type:Number, required:true}
});

UserSchema.pre('save',function(next){
    var user = this;
    bcrypt.hash(user.password,null,null,function(err, hash) {
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

module.exports = mongoose.model('User',UserSchema);