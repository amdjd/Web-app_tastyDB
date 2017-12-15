 var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurant2testSchema = new Schema({
    name:String,
    point:Number,
    picture:String,
    tel:String,
    address:String,
    loc: {
        type: { type: String },
        coordinates: []
    },
    businesshours:String,
    type:String,
    review:{
        type:Number,
        default:0
    }
});

restaurant2testSchema.index({ "loc": "2dsphere" });

module.exports=mongoose.model('restaurant2test', restaurant2testSchema);