var express = require('express');
var app = express();
var mongoose = require('mongoose');
var cloudinary = require('cloudinary').v2;
var models = require('./model');
var Store = models.Store;
var Product = models.Product;
var UserSearch = models.UserSearch;
var User = models.User;
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
app.use(cookieParser())
mongoose.createConnection("mongodb://shop_dir:shop_dir@ds023912.mlab.com:23912/shoppins",function (err) {
  if (err) {
    console.log(err);
  }
  else
    console.log("db connection established");
});

function readStore(req, res)
{
            Store.find({},function (error, result) {
              if (error){
                console.log("error while reading");
              }
              else{
                res.render('index.jade',{json:result});
              }
                
            });
           
 }

 function editStore(req, res)
{
            console.log(req.params.id);
            Store.findById(req.params.id,function (error, result) {
              if (error){
                console.log("error while reading");
              }
              else{
                res.render('editStore',{json:result});
                //res.json(result);
                console.log(result);
              }
                
            });
           
 }

function updateStore(req, res)
{
          cloudUpload(req, res, function( imgArray, imgArrayMin){
            Store.findById(req.params.id, function (err, item) {
              if (err){
                        callback(err, null);
              }
              else {
            item.name = req.body.name;
            item.bannerImage = imgArray[0];
            item.bannerImageMin = imgArrayMin[0];
            // item.description = req.body.description;
            // item.category = req.body.category;
            // item.subCategory  = req.body.subCategory;
            //item.price = res.price;
                        item.save(function (err, result) {
                          //callback(err, result);
                          console.log("store updated");
                          console.log(result);
                          // readProducts(req, res);
                          res.json(result);

                        });
              }
            });
          });
}

function cloudUpload(req, res, callback){
      var imgArray = [];
      var imgArrayMin = [];
            // console.log(req.file);
            // console.log(req.files);
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

 function createStore(req, res){
  var store = new Store();
  var address = {};
  cloudUpload(req, res, function( imgArray, imgArrayMin){
  item = req.body;
            store.name = item.name;
            address = item;
            store.address = address;
            store.bannerImage = imgArray[0];
            store.bannerImageMin = imgArrayMin[0];
            console.log(address);
            store.category = item.category.split(",");
            console.log(store.category);
            console.log("creating store");
            console.log(store); 
            store.save(function (error,result) {
              //callback(error, result);
              if (error){
                console.log("error" + error);
              }
              else{
                
                console.log("result");
                saveSearchList(req.body.name,"store",address.city,req,res);
                for (var i = store.category.length - 1; i >= 0; i--) {
                    saveSearchList(store.category[i],"store-category",address.city,req,res);
                 };

              }
            });
            readStore(req, res);
          });
}

exports.addCollections = function addCollections(req, res)
{
          cloudUpload(req, res, function( imgArray, imgArrayMin){
            Store.findById(req.params.id, function (err, item) {
              if (err){
                        callback(err, null);
              }
              else {
            item.collections = imgArray;
            item.collectionsMin = imgArrayMin;
                        item.save(function (err, result) {
                          //callback(err, result);
                          console.log("collections added successfully");
                          console.log(result);
                          // readProducts(req, res);
                          res.json(result);

                        });
              }
            });
          });
 }

exports.associateStore = function associateStore(req,res){
    Store.find({userEmail:null},function(err,store){
      console.log(store);
      res.render('StoreAssociation.jade',{json:store});
    });
}

exports.association = function association(req, res){
    
    User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;
    console.log(user);
    if (!user) {
      res.json({ success: false, message: ' User not found.' });
    } else if (user) {
        user.storeId = req.body.store;
        user.save(function(err, result){
          console.log(result);
        });

        Store.findById(req.body.store, function (err, item) {
              if (err){
                        callback(err, null);
              }
              else {
            item.userEmail = req.body.email;
                        item.save(function (err, result) {
                          //callback(err, result);
                          console.log("admin added to store successfully");
                          console.log(result);
                          // readProducts(req, res);
                          res.json(result);

                        });
              }
            }); 
      }

  });
}

exports.createStoreData = createStore;
exports.updateStoreData = updateStore;
exports.editStoreData = editStore;
