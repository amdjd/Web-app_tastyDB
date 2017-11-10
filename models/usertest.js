var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var usertestSchema = new Schema({
    user_id:{
    type: String,
    unique: true
    },
    email:{
    type: String,
    unique: true
    },
    password:String,
    name:String
});

usertestSchema.statics.authenticate = function (user_id, password, callback) {
  User.findOne({ user_id: user_id })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

usertestSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

var User = mongoose.model('usertest', usertestSchema);
module.exports = User;