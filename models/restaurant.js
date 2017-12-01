var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurantSchema = new Schema({
    name:String,
    point:Number,
    picture:String,
    tel:String,
    address:String,
    latiude:Number,
    longitude:Number,
    businesshours:String,
    menu:String

});

module.exports=mongoose.model('restaurant',restaurantSchema);