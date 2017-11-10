var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservationSchema = new Schema({
    date:[{
        year:Number,
        month:Number,
        day:Number,
        time:Number
        }],
    number:Number,
    complete:Boolean

});

module.exports=mongoose.model('reservation',reservationSchema);   