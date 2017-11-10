 var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restauranttestSchema2 = new Schema({
    name:String,
    point:Number,
    picture:Buffer,
    tel:String,
    address:String,
    latiude:Number,
    longitude:Number,
    businesshours:String,
    menu:String

});

module.exports=mongoose.model('restauranttest2',restauranttestSchema2);