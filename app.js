var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/usertest');
var Restaurant = require('./models/restauranttest2');
var Review = require('./models/review');
var Reservation = require('./models/reservation');

mongoose.connect('mongodb://localhost:27017/store')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(3000,function() {
    console.log("Express server has started on port 3000");
})

app.locals.pretty = true;

app.get('/get-userdata', function(req, res) {
  User.find(function(err, users){
        if(err) return res.status(500).send({error: 'database failure'});
        res.send(users);
    })
});


app.get('/get-restaurant', function(req, res) {
  Restaurant.find(function(err, restaurant){
        if(err) return res.status(500).send({error: 'database failure'});
        res.send(restaurant);
    })
});

app.post('/login', function(req, res,next){
    User.authenticate(req.body.user_id, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        res.send("Succes");
      }    
    });
});

app.post('/insert-user', function(req, res,next){
    User.findOne({ user_id: req.body.user_id })
    .exec(function (err, user) {
      if (!user) {
        var newUser = new User();
        newUser.user_id = req.body.user_id;
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        newUser.name = req.body.name;
        console.log("\n\n post req.body.user_id="+req.body.user_id);
        newUser.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
        }
        res.send("Succes");
        });
      } else{
        res.send("exist id");
      }
    });
});


app.post('/insert-restaurant', function(req, res,next){
    Restaurant.findOne({ name: req.body.name })
    .exec(function (err, restaurant) {
      if (!restaurant) {
        var newRestaurant = new Restaurant();
        newRestaurant.name = req.body.name;
        newRestaurant.point = 0;
        newRestaurant.picture = req.body.picture;
        newRestaurant.tel = req.body.tel;
        newRestaurant.address = req.body.address;
        newRestaurant.latiude = req.body.lat;
        newRestaurant.longitude = req.body.lng;
        newRestaurant.businesshours = req.body.businesshours;
        newRestaurant.menu = req.body.menu;

        
        console.log("\n\n post req.body.user_id="+req.body.user_id);
        newRestaurant.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
        }
        res.send("Succes");
        });
      } else{
        res.send("exist id");
      }
    });
});


module.exports = app;
