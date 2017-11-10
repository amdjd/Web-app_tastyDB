var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    user_id:String,
    point:Number,
    memo:String,
    date:{type:Date,default:Date.now}
});

module.exports=mongoose.model('review',reviewSchema);
