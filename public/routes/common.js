var cloudinary = require('cloudinary').v2;
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var express = require('express');
var app = express();
var models = require('./model');
var UserSearch = models.UserSearch;

app.use(cookieParser())

function cloudUpload(req, res, callback){
      var imgArray = [];
      var imgArrayMin = [];
            var size = req.files.length;
            var counter = 0;
            for(i=0; i<size;i++){
            cloudinary.uploader.upload(req.files[i].path, { eager: [
              { width: 112, height: 112, crop: "pad" }
             ]},
                function(req, res) {
                console.log("image upload");
                imgArray.push(res.url);
                imgArrayMin.push(res.eager[0].url)
                console.log(res.url);
                counter = counter + 1;
                console.log("initial counter" + counter);
                if(counter == size){
                  console.log(counter);
                callback(imgArray, imgArrayMin);
              }
            });
            }
 }

 function authenticateUser(req, res, callback){
  var token = req.cookies.auth;
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, 'shhhhhhared-secret', function(err, decoded) {
      if (err) {
        var message = "fail";
        callback(message);
        //return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        var message = "pass";
        callback(message);
        //next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
      }
}

function saveSearchList(query,kind,location,req,res){
  var userSearch = new UserSearch();
    var delimiter = "#&#";
    userSearch.userSearchString = query+delimiter+kind+delimiter+location;
    console.log(query+delimiter+kind+delimiter+location);
    userSearch.location = location;
    userSearch.save(function(err){
      if(err){
        console.log(err)
      }
    });
};


exports.authenticateUser = authenticateUser;
exports.cloudUpload = cloudUpload;
exports.saveSearchList = saveSearchList;
