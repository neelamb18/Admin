var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var engines = require('consolidate');
var cloudinary = require('cloudinary').v2;
var multer = require('multer');
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
 mongoose.connect("mongodb://localhost:27017/allProducts",function (err) {
  if (err) {
    console.log(err);
   }
 });


// cloudinary.uploader.upload("/rakhi.jpg", function(req, res) { 
// 	console.log("image upload");
//   console.log(res.url); 
// });

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

app.get('/editStore/:id', function(req,res){
	//res.send('hello world');
	console.log("store edit");
	console.log(req.params.id);
	res.render('editStore.jade',{storeid:req.params.id});
	
});

// app.get('/ViewProductsPage', function(req,res){
// 	//res.send('hello world');
// 	//console.log("Store is added");
// 	res.render('showProducts.jade');
	
// });
// app.post('/createProduct', multer({ dest: './uploads/'}).single('file'), function(req,res){
// 	//res.send('hello world');
// 	 console.log(req.file.path);
// 	 console.log(req.body);
// 	//res.render('AddProduct.html');
// 	// var fstream;
//  //    req.pipe(req.busboy);
//  //    req.busboy.on('')
//  //    req.busboy.on('file', function (fieldname, file, filename) {
//  //        console.log("Uploading: " + filename); 
//  //        console.log(fieldname);
//  //        fstream = fs.createWriteStream(__dirname + '/files/' + filename);
//  //        file.pipe(fstream);
//  //        fstream.on('close', function () {
//  //            res.redirect('back');
//  //        });
//  //    });
// });


/**
*
* Define the route handlers
**/
console.log("neelam");
// app.get('/getCreateForm', routes.getCreateForm);
// app.get('/getUpdateForm', routes.getUpdateForm);
// app.get('/getDeleteForm', routes.getDeleteForm);

app.get('/', routes.index);
app.post('/createProduct/:id', multer({ dest: './uploads/'}).array('file',3), routes.createProduct);
app.post('/storePost', routes.createStoreData);
app.get('/editProduct/:id', routes.editProductData);
app.get('/ViewProductsPage/:id', routes.readProductsData);
app.post('/updateProduct/:id', routes.updateProductData);
app.get('/deleteProduct/:id', routes.deleteProductData);
console.log("bandaru");
//app.get('/users', user.list);

app.listen(3000,function(){
	console.log(__dirname);
});



