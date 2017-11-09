var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var UserSchema = new Schema({
    username:{type: String, lowercase:true, minlength: 3,maxlength:30, required:true, unique:true, match:/^[a-zA-Z0-9]*$/},
    password:{type: String, required:true, min:8, max:30 ,match:/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,30}$/},
    firstName: {type: String, required:true, minlength: 3, maxlength:30, match:/^[a-zA-Z]*$/},
    lastName: {type: String, required:true, minlength: 3, maxlength:30, match:/^[a-zA-Z]*$/},
    //fullName:{type:String},
    
    email:{type:String, required:true, lowercase:true, unique:true, min:3, max:25, match:/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/},
    mobileNumber:{type:String, required:true, match:/^((\+91[\-\s]?)|[0])?([7-9])(\d{9})$/, unique:true},
    //age:{type:Number, required:true, min:18, max:60},
    date:{type:Date, required:true},
    gender:{type:String, required:true, enum: ['M','F']},
    bloodGroup:{type:String, required:true, enum: ['A+','B+','O+','A-','B-','O-','AB+','AB-']},
    weight:{type:Number, required:true, min:30, max:150},

    userType:{type:String, default:'donor'}
});

UserSchema.pre('save',function(next){
    var user = this;
    bcrypt.hash(user.password,null,null,function(err, hash) {
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.plugin(titlize,{
    paths: ['firstName','lastName']
});

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',UserSchema);