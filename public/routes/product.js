var express = require('express');
var app = express();
var mongoose = require('mongoose');
var cloudinary = require('cloudinary').v2;
var models = require('./model');
var Store = models.Store;
var Product = models.Product;
var userSearch = models.userSearch;
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

exports.index = function(req, res){
  common.authenticateUser(req, res, function(message){
    if(message=="pass"){
      readStore(req, res);
    }
    else
      res.json({mes : 'authentication failed'});
  })
}

function readProducts(req, res){
            Product.find({store:req.params.id},function (error, result) {
            	if (error){
            		console.log("error while reading");
            	}
            	else{
            		res.render('showProducts',{json:result});
            	}
            });
 }

function editProduct(req, res){
            Product.findById(req.params.id,function (error, result) {
            	if (error){
            		console.log("error while reading");
            	}
            	else{
            		res.render('editProducts',{json:result});
            	}
            });
 }

function updateProduct(req, res){
            Product.findById(req.params.id, function (err, item) {
              if (err){
                        callback(err, null);
              }
              else {
                        item = req.body;
                        item.save(function (err, result) {
                          //callback(err, result);
                          readProducts(req, res);
                        });
              }
            });
 }

function deleteProduct(req,res){
            Product.findById(req.params.id, function (err, item) {
              if (err){
                        console.log("error");
              }
              else {
                        Product.remove(item,function (err, result) {
                        	readProducts(req, res);
                        });
              }
            });
 }

 exports.createProduct = function(req, res){
      var product = new Product();
      var price = {};
      city_name = "";
      common.cloudUpload(req, res, function( imgArray, imgArrayMin){
            item = req.body;
            product.name = item.name;
            product.description = item.description;
            product.category = item.category;
            product.subCategory = item.subCategory;
            price.value = item.price;
            price.currency = "INR";
            product.price = price;

            product.store = mongoose.Types.ObjectId(req.params.storeid);
            product.images = imgArray;
            product.imagesMin = imgArrayMin;
            Store.findById(mongoose.Types.ObjectId(req.params.storeid),function(err,store){
				if(err){
					console.log("inside save of product");
					//res.send(err);
					console.log(err);

				}
				else{

					//res.send(stores);
					city_name = store.address.city;
          product.address =  store.address;
				}
		})
		product.save(function(err){
			if(err){
				if(err.code == 11000){
					return res.json({success:false,'message':'Product already exists'});
				}
				else{
					console.log(err);
					return res.send(err);

				}
			}

			common.saveSearchList(item.name.toLowerCase(),"product",city_name,req,res);
			common.saveSearchList(item.category.toLowerCase(),"product-category",city_name,req,res);
			common.saveSearchList(item.subCategory.toLowerCase(),"product-subcategory",city_name,req,res);
			//res.json({message:"Product created"});
		});

	            readProducts(req, res);
          });
}

exports.login = function(req, res){
  User.findOne({
    email: req.body.name
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      user.comparePasswords(req.body.password, function(err, isMatch) {
        if (!isMatch) {
         res.json({ success: false, message: 'Authentication failed. Wrong password.' });
         } else {
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, 'shhhhhhared-secret', {
          expiresIn: 1440 // expires in 24 hours
        });
       res.cookie('auth',token);
       res.render('index.jade', {json:user});
        }
       });
      }
  });
}
exports.readProductsData = readProducts;
exports.updateProductData = updateProduct;
exports.deleteProductData = deleteProduct;
exports.editProductData = editProduct;
