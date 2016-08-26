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
var common = require('./common');

app.use(cookieParser())
mongoose.createConnection("mongodb://shop_dir:shop_dir@ds023912.mlab.com:23912/shoppins",function (err) {
  if (err) {
    console.log(err);
  }
});

function readStore(req, res){
            Store.findById(req.params.id,function (error, result) {
              if (error){
                console.log("error while reading");
              }
              else{
                res.render('showCollections.jade',{json:result});
              }
            });
 }

 function editStore(req, res){
            Store.findById(req.params.id,function (error, result) {
              if (error){
                console.log("error while reading");
              }
              else{
                res.render('editStore',{json:result});
              }
            });
 }

function updateStore(req, res){
          common.cloudUpload(req, res, function( imgArray, imgArrayMin){
            Store.findById(req.params.id, function (err, item) {
              if (err){
                        callback(err, null);
              }
              else {
            item.name = req.body.name;
            item.bannerImage = imgArray[0];
            item.bannerImageMin = imgArrayMin[0];
                        item.save(function (err, result) {
                          //callback(err, result);
                        res.json(result);
                        });
              }
            });
          });
}

 function createStore(req, res){
  var store = new Store();
  var address = {};
  common.cloudUpload(req, res, function( imgArray, imgArrayMin){
  item = req.body;
            store.name = item.name;
            address = item;
            store.address = address;
            store.bannerImage = imgArray[0];
            store.bannerImageMin = imgArrayMin[0];
            store.category = item.category.split(",");
            store.save(function (error,result) {
              //callback(error, result);
              if (error){
                console.log("error" + error);
              }
              else{
                common.saveSearchList(req.body.name,"store",address.city,req,res);
                for (var i = store.category.length - 1; i >= 0; i--) {
                    saveSearchList(store.category[i].toLowerCase(),"store-category",address.city,req,res);
                 };
              }
            });
            res.json(result);
          });
}

exports.addCollections = function addCollections(req, res){
          common.cloudUpload(req, res, function( imgArray, imgArrayMin){
            Store.findByIdAndUpdate(req.params.id, {$push:{collections:{$each:imgArray},collectionsMin:{$each:imgArrayMin}}}, function (err, item) {
              if (err){
                    callback(err, null);
              }
            });
          });
 }

exports.associateStore = function associateStore(req,res){
    Store.find({userEmail:null},function(err,store){
      res.render('StoreAssociation.jade',{json:store});
    });
}

exports.association = function association(req, res){
    User.findOneAndUpdate({
    email: req.body.email
  }, {$push:{storeId:req.body.store}}, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.json({ success: false, message: ' User not found.' });
    } else if (user) {
        Store.findByIdAndUpdate(req.body.store, {$push:{userEmail:req.body.email}}, function (err, item) {
              if (err){
                        callback(err, null);
              }
              else {
                  res.json(item);
              }
            });
      }
  });
}

exports.createStoreData = createStore;
exports.updateStoreData = updateStore;
exports.editStoreData = editStore;
exports.showCollections = readStore;
