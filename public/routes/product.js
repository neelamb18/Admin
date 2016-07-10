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

exports.index = function(req, res){
  authenticateUser(req, res, function(message){
    if(message=="pass"){
      readStore(req, res);
    }
    else
      res.json({mes : 'authentication failed'});
  })
  
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

function readProducts(req, res)
{
            Product.find({store:req.params.id},function (error, result) {
            	if (error){
            		console.log("error while reading");
            	}
            	else{
            		res.render('showProducts',{json:result});
            	}
              	
            });
           
 }

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

function editProduct(req, res)
{
            console.log(req.params.id);
            Product.findById(req.params.id,function (error, result) {
            	if (error){
            		console.log("error while reading");
            	}
            	else{
            		res.render('editProducts',{json:result});
            		//res.json(result);
            		console.log(result);
            	}
              	
            });
           
 }

function updateProduct(req, res)
{
            Product.findById(req.params.id, function (err, item) {
              if (err){
                        callback(err, null);
              }
              else {
            item.name = req.body.name;
            item.description = req.body.description;
            item.category = req.body.category;
            item.subCategory  = req.body.subCategory;
            //item.price = res.price;
                        item.save(function (err, result) {
                          //callback(err, result);
                          console.log("item updated");
                          readProducts(req, res);
                        });
              }
            });
 }

function deleteProduct(req,res)
{
			console.log(req.params.id);
            Product.findById(req.params.id, function (err, item) {
              if (err){
                        console.log("error");
              }
              else {
                        Product.remove(item,function (err, result) {
                        	console.log("item deleted");
                        	readProducts(req, res);
                          //callback(err, result);
                        });
              }
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
 

 exports.createProduct = function(req, res){
      console.log(req.files);
      console.log(req.files[0].path);
      cloudUpload(req, res, function( imgArray, imgArrayMin){
        
            var product = new Product();
            var price = {};
            console.log("clodinary done");
            console.log(imgArray);
            console.log(imgArray[0]);
            item = req.body;
            product.name = item.name;
            product.description = item.description;
            product.category = item.category;
            product.subCategory = item.subCategory;
            price.value = item.price;
            price.currency = "INR";
            product.price = price; 
            product.store = req.params.id;
            product.images = imgArray;
            product.imagesMin = imgArrayMin;
            console.log("creating data");
            console.log(product); 
            product.save(function (error,result) {
              //callback(error, result);
              if (error){
              	console.log("error" + error);
              }
              else{
              	
              	console.log("result");

              }
            });
            readProducts(req, res);
          
          });

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

exports.authenticate = authenticateUser;

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

exports.signup = function(req, res){
  
  var user = new User();
  user = req.body;
  console.log(req.body);
  //console.log(user);

  user.save(function (error,result) {
    if (error){
                console.log("error" + error);
              }
              else{
                
                console.log("result");

              }
  });
}

exports.login = function(req, res){
  console.log(req.body.name);
  User.findOne({
    email: req.body.name
  }, function(err, user) {

    if (err) throw err;
    console.log(user);
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
      // res.json({
      //     success: true,
      //     message: 'Enjoy your token!',
      //     token: token
      //     });
       res.cookie('auth',token);
          res.send('ok');
       //alert("user is logged in");
        }
       });   
      }

  });
}

exports.createStoreData = createStore;
exports.readProductsData = readProducts;
exports.updateProductData = updateProduct;
exports.deleteProductData = deleteProduct;
exports.editProductData = editProduct;

