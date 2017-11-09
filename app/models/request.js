var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');

var ReqSchema = new Schema({
    patientName: {type: String, required:true, minlength: 3, maxlength:30, match:/^[a-zA-Z ]*$/},
    bloodGroup:{type:String, required:true, enum: ['A+','B+','O+','A-','B-','O-','AB+','AB-']},
    bloodUnit:{type:Number, required:true, min:1, max:12},

    contactName: {type: String, required:true, minlength: 3, maxlength:30, match:/^[a-zA-Z ]*$/},
    contactEmail:{type:String, required:true, lowercase:true, match:/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/},
    contactNumber:{type:String, required:true, match:/^((\+91[\-\s]?)|[0])?([7-9])(\d{9})$/},
    date:{type:Date, required:true}
});

ReqSchema.plugin(titlize,{
    paths: ['patientName','contactName']
});

module.exports = mongoose.model('Request',ReqSchema);