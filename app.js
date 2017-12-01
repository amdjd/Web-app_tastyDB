var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/usertest');
var multer = require('multer');
var Restaurant = require('./models/restaurant2test');
var Review = require('./models/review');
var app = express();

mongoose.connect('mongodb://localhost:27017/store')

app.use('/uploads',express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//multer
const path = require('path');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});

var server = app.listen(3000,function() {
    console.log("Express server has started on port 3000");
})

app.locals.pretty = true;





/////리뷰관련/////
//이미지
app.post('/api/photo', upload.single('uploaded_file'), function (req, res) {
    res.send(req.file.path);
    //console.log(JSON.stringify(req.file.path));
    console.log(req.file.path);
});
//등록
app.post('/insert-review', function(req, res,next){
    Review.findOne({$and:[{ user_id: req.body.user_id },{resname : req.body.resname}]})
    .exec(function (err, restaurant) {
      if (!restaurant) {
        var newReview = new Review();
        newReview.user_id = req.body.user_id;
        newReview.resname = req.body.resname;
        newReview.point = req.body.point;
        newReview.memo = req.body.memo;
        newReview.picture = req.body.picture;

        console.log("\n\n post review - user_id="+req.body.user_id);
        newReview.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
        }
        res.send("Succes");
        });
      } else{
        res.send("exist review");
      }
    });
});

//전체 호출
app.get('/get-review', function(req, res) {
  Review.find(function(err, reviews){
        if(err) return res.status(500).send({error: 'database failure'});
        res.send(reviews);
    })
});

//식당 호출
app.post('/query-resview', function(req, res) {
Review.find({ resname: req.body.name })
    .exec(function (err, restaurant) {
        if(err){ 
            console.log("err");
            return res.status(500).send({error: 'database failure'});
        }
        console.log(restaurant);
        res.send(restaurant);
    });
});

//유저 호출
app.post('/query-userview', function(req, res) {
Review.find({ user_id: req.body.user_id })
    .exec(function (err, review) {
        if(err){ 
            console.log("err");
            return res.status(500).send({error: 'database failure'});
        }
        res.send(review);
    });
});

//수정

//삭제 
app.get('/del-reivew', function(req, res) {
  Review.remove({ _id: "5a20099b5a3b177038bba087" }, function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });
        res.status(204).end();
      console.log("ok");
    })
});


/////식당관련/////
//전체 호출
app.get('/get-restaurant', function(req, res) {
  Restaurant.find(function(err, restaurant){
        if(err) return res.status(500).send({error: 'database failure'});
        res.send(restaurant);
    })
});

//이름으로 한 개 호출
app.post('/query-oneres', function(req, res) {
Restaurant.find({ name: req.body.name })
    .exec(function (err, restaurant) {
        if(err){ 
            console.log("err");
            return res.status(500).send({error: 'database failure'});
        }
        res.send(restaurant);
    });
});

//거리 탐색
app.post('/query-res', function(req, res) {
    var limit = 30;
    var maxDistance = req.body.distance;
    
    var coords = [];
    coords[0] = req.body.longitude;
    coords[1] = req.body.latitude;
    
    console.log(req.body.distance +"/longitude" +req.body.longitude +"/latitude" +req.body.latitude);
    
    Restaurant.find({
        loc:{
        $near: {
                $geometry: {
                    type: "Point",
                    coordinates: coords
                    },
                $maxDistance: maxDistance* 1609.34
                }
            }
    }).limit(limit).exec(function (err, stores){
        if (err) {
        return res.status(500).json(err);
        console.log("find err");
    }else{
        res.status(200).json(stores);
        console.log("oK");
        }
    });
        
});


//등록
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
        newRestaurant.loc.type = "Point";
        newRestaurant.loc.coordinates = [req.body.lng, req.body.lat]
        //newRestaurant.latiude = req.body.lat;
        //newRestaurant.longitude = req.body.lng;
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

//
app.get('/del-res', function(req, res) {
  Restaurant.remove({ _id: "5a0d4e0940abab4cbd033695" }, function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });

        /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
        if(!output.result.n) return res.status(404).json({ error: "book not found" });
        res.json({ message: "book deleted" });
        */

        res.status(204).end();
    })
});

//
app.get('/get', function(req, res) {
    Restaurant.find({ name: "논밭집" })
        .exec(function (err, restaurant) {
            if(err){ 
                console.log("err");
                return res.status(500).send({error: 'database failure'});
            }
            console.log("ok");
            res.send(restaurant);
        });
    });


/////회원 관련/////
//전체 호출
app.get('/get-userdata', function(req, res) {
  User.find(function(err, users){
        if(err) return res.status(500).send({error: 'database failure'});
        res.send(users);
    })
});

//로그인
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

//가입
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




module.exports = app;
