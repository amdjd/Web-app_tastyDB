var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    user_id:String,
    resname:String,
    point:Number,
    memo:String,
    picture:String,
    date:{type:Date,default:Date.now}
});

module.exports=mongoose.model('review',reviewSchema);
