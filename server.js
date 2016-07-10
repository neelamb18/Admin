var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var engines = require('consolidate');
var cloudinary = require('cloudinary').v2;
var multer = require('multer');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
//var upload = multer({dest: './files/'});

// var fs = require('fs');
// var busboy = require('connect-busboy');
// app.use(busboy());
 //app.use(express.methodOverride());
 //app.use(express.multipart());
   

cloudinary.config({
    cloud_name: 'shoppingdirectory',
    api_key: '967339527283183',
    api_secret: '74NXckYl9m1-O0_ZTU8U_qoIDfw'
});
mongoose.Promise = require('bluebird');
//assert.equal(query.exec().constructor, require('bluebird'));
 mongoose.connect("mongodb://shop_dir:shop_dir@ds023912.mlab.com:23912/shoppins",function (err) {
  if (err) {
    console.log(err);
   }
 });

// cloudinary.uploader.upload('download.jpg', { eager: [
//         { width: 400, height: 300, crop: "pad" }, 
//         { width: 260, height: 200, crop: "crop", gravity: "north"} ]},
//         function(req, res) { 
//                 console.log("eager upload");
//                 console.log(res.url);
//                 console.log(res.eager[0].url);
//                 console.log(res.eager[1].url);
//             });

app.set('views', __dirname + '/public/views');
//app.engine('html', engines.mustache);
app.set('view engine', 'jade');

app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); //for parsing
app.use(express.static(__dirname + '/public' ));
var routes = require(__dirname +'/public/routes/product');
app.get('/AddProductsPage/:id', function(req,res){
	//res.send('hello world');
	console.log(req.params.id);
	res.render('AddProduct.jade',{storeid:req.params.id});
	
});

app.get('/storePostPage', function(req,res){
	//res.send('hello world');
	console.log("Store is added");
	res.render('storePost.jade');
	
});

app.get('/', function(req, res){
	res.render('login.jade');
});

// app.get('/editStore/:id', function(req,res){
// 	//res.send('hello world');
// 	console.log("store edit");
// 	console.log(req.params.id);
// 	res.render('editStore.jade',{storeid:req.params.id});
	
// });

app.get('/signup', function(req, res){
	res.render('signup.jade');
});
// app.get('/ViewProductsPage', function(req,res){
// 	//res.send('hello world');
// 	//console.log("Store is added");
// 	res.render('showProducts.jade');
	

/**
*
* Define the route handlers
**/
console.log("neelam");

app.get('/index', routes.index);

app.post('/signup', routes.signup);
app.post('/login', routes.login);
app.post('/createProduct/:id', multer({ dest: './uploads/'}).array('file',3), routes.createProduct);
app.post('/storePost', multer({ dest: './uploads/'}).array('file',3), routes.createStoreData);
app.post('/updateStore/:id', multer({ dest: './uploads/'}).array('file',3), routes.updateStoreData);
app.get('/editStore/:id', routes.editStoreData);
app.get('/editProduct/:id', routes.editProductData);
app.get('/ViewProductsPage/:id', routes.readProductsData);
app.post('/updateProduct/:id', routes.updateProductData);
app.get('/deleteProduct/:id', routes.deleteProductData);
console.log("bandaru");
//app.get('/users', user.list);

app.listen(3000,function(){
	console.log(__dirname);
});



