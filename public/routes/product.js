var mongoose = require('mongoose');
var cloudinary = require('cloudinary').v2;
//var Schema  = mongoose.Schema;
//mongoose.connect('mongodb://localhost:27017/product');
var relationship = require("mongoose-relationship");
var Schema  = mongoose.Schema;
mongoose.Promise = require('bluebird');
//assert.equal(query.exec().constructor, require('bluebird'));
mongoose.createConnection("mongodb://localhost:27017/allProducts",function (err) {
  if (err) {
    console.log(err);
  }
  else
  	console.log("db connection established");
});

var UserID = new Schema({
	userId : String
});
var Price = new Schema({
	value:Number,
	currency:String
});
var Review = new Schema({
    description  : String, 
    date  : Date,
    time : { type : Date, default: Date.now },
    userId : UserID,
    upvotes : [UserID]
});
var ProductSchema = new Schema({
	name:String,
	description:String,
	category:String,
	subCategory:String,
	price:Price,
	sizesAvailable:String,
	comments:[Review],
	upvotes:[UserID],
	images:[String],
  reviews:[{ type:Schema.ObjectId, ref:"Review" }],
  upvotes:[{ type:Schema.ObjectId, ref:"Upvote" }],
  store: { type:Schema.ObjectId, ref:"Store", childPath:"products" }
});

var Address = new Schema({
  doorNo:String,
  city:String,
  state:String,
  country:String,
  district:String,
  zipCode:String,
  area:String,
  locality:String
});

var StoreSchema = new Schema({
  name:String,
  address:Address,
  category:[String],
  reviews:[{ type:Schema.ObjectId, ref:"Review" }],
  products:[{ type:Schema.ObjectId, ref:"Product" }],
  upvotes:[{ type:Schema.ObjectId, ref:"Upvote" }],
  bannerImage:{type:String,default:'https://upload.wikimedia.org/wikipedia/commons/3/3a/SM_Department_Store_Cubao.jpg'},
  storeImages:[String],
  visits:[{ type:Schema.ObjectId, ref:"Visit" }]
},{ collection : 'stores' });

ProductSchema.plugin(relationship, { relationshipPathName:'store' });

console.log("json1");
var Product = mongoose.model('Product',ProductSchema);
//var Price = mongoose.model('Price',Price);
//var MyImage = mongoose.model('MyImage' ,ImageLink);
var Store = mongoose.model('Store',StoreSchema);

exports.index = function(req, res){
	//res.render('index.jade');
  readStore(req, res);
}

/**
*
*Create Product
**/
// function createProduct(item, callback)
// {
//             var product = new Product();
           
//             product.name = item.name;
//             product.description = item.description;
//             product.category = item.category;
//             product.subCategory = item.subCategory;
//             product.price = item.price
//             //product.created = new Date();
//             //product.updated = new Date();
//             console.log("creating data");
//             console.log(product); 
//             product.save(function (error) {
//               //callback(error, result);
//               if (error){
//               	console.log("error" + error);
//               }
//               else{
//               	console.log("result");
//               }
//             });
//  }

/**
*
*Read Product
**/
function readProducts(req, res)
{
            Product.find({store:req.params.id},function (error, result) {
            	if (error){
            		console.log("error while reading");
            	}
            	else{
            		res.render('showProducts',{json:result});
            		//res.json(result);
            		//console.log(result);
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
                //res.json(result);
                //console.log(result);
              }
                
            });
           
 }
/**
*
*Edit Product
**/
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
 exports.editProductData = editProduct;


/*
*
* Update Product
**/
function updateProduct(req, res)
{
            Product.findById(req.params.id, function (err, item) {
              if (err){
                        callback(err, null);
              }
              else {
                        //item.updated = new Date();
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

/**
*
* Delete Product
**/
function deleteProduct(req,res)
{
			console.log(req.params.id)
			//console.log(req.query['_id']);
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
      var imgarray = [];
            //var myImage = new MyImage();
            var size = req.files.length
            for(i=0; i<size;i++){
            cloudinary.uploader.upload(req.files[i].path, function(req, res) { 
                console.log("image upload");
                imgarray.push(res.url);
                console.log(res.url); 
                
            });
            }
            callback(imgarray);
 }
 

 exports.createProduct = function(req, res){
 			console.log(req.body);
      console.log(req.files);
      console.log(req.files[0].path);
      //console.log(req.body.file.thumbnail);
      //console.log(req.body.price.value);
      cloudUpload(req, res, function(imgarray){
            var product = new Product();
            var price = {};
            // var imgarray = [];
          
            // var size = req.files.length
            // for(i=0; i<size;i++){
            // cloudinary.uploader.upload(req.files[i].path, function(req, res) { 
            //     console.log("image upload");
            //     imgarray.push(res.url);
            //     console.log(res.url); 
            // });
            // }
            console.log("clodinary done");
            console.log(imgarray);
            console.log(imgarray[0]);
            item = req.body;
            product.name = item.name;
            product.description = item.description;
            product.category = item.category;
            product.subCategory = item.subCategory;
            price.value = item.price;
            price.currency = "INR";
            product.price = price;
            product.store = req.params.id;
            // myImage.imageLink = res.url;
            product.image = imgarray;
            //product.images = res.url;
            //product.created = new Date();
            //product.updated = new Date();
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
        //     createProduct(req.body, function(error,result){
        //                 if (error) {
        //         res.send({'result':'error'});
        // }else {                            
        //                             console.log("callback");
        //                             console.info(" result:"+ JSON.stringify(result));
        //                              readProductData(req, res);
        //         }
        //     });
}

//  function readProductData(req, res){
//             readProducts(function(error,result){
//                         if (error) {
//                 console.log("entered reading data error");        	
//                 res.send({'result':'error'});
//         }else {                            
//                                     console.log("reading data");
//                                     console.info(" result:"+ JSON.stringify(result));
//                                      res.render('showProducts',{title:'Reading from Mongo DB now ........',"result": JSON.stringify(result)});
//                 }
//             });
// }

function createStore(req, res){
  var store = new Store();
  var address = {};
  item = req.body;
            store.name = item.name;
            address.city = item.city;
            address.doorno = item.doorno;
            address.state = item.state;
            //storealue = item.price;
            address.country = item.country;
            address.district = item.district;
            address.zipcode = item.zipcode;
            address.area = item.area;
            address.locality = item.locality;
            store.address = address;
            console.log(address);
            store.category = item.category.split(",");
            console.log(store.category);
            // myImage.imageLink = res.url;
            // product.image = myImage.imageLink;
            //store.images = res.url;
            //product.created = new Date();
            //product.updated = new Date();
            console.log("creating store");
            console.log(store); 
            store.save(function (error,result) {
              //callback(error, result);
              if (error){
                console.log("error" + error);
              }
              else{
                
                console.log("result");

              }
            });
            readStore(req, res);
}
exports.createStoreData = createStore;
exports.readProductsData = readProducts;
exports.updateProductData = updateProduct;

// exports.updateEmployee = function(req, res){
//             updateEmployee(req.query['_id'],req.query['name'],req.query['address'], function(error,result){
//                         if (error) {
//                 res.send({'result':'error'});
//         }else {                            
//                                     console.info(" result:"+ JSON.stringify(result));
//                                      res.send('Data Updated');
//                 }
//             });
// }

exports.deleteProductData = deleteProduct;

// exports.deleteProductdata = function(req, res){
//             //console.log("in here.................."+req.query['_id']);
//             deleteProduct(req.query['_id'],function(error,result){
//                         if (error) {
//                 res.send({'result':'error'});
//         }else {                            
//                                     console.info(" result:"+ JSON.stringify(result));
//                                      res.send('Data Deleted');
//                 }
//             });
// }