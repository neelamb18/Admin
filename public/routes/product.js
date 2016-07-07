var mongoose = require('mongoose');
var cloudinary = require('cloudinary').v2;
var models = require('./model');
var Store = models.Store;
var Product= models.Product;
mongoose.createConnection("mongodb://localhost:27017/allProducts",function (err) {
  if (err) {
    console.log(err);
  }
  else
    console.log("db connection established");
});

exports.index = function(req, res){
  readStore(req, res);
}

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
      var imgarray = [];
            var size = req.files.length;
            var counter = 0;
            for(i=0; i<size;i++){
            cloudinary.uploader.upload(req.files[i].path, function(req, res) { 
                console.log("image upload");
                imgarray.push(res.url);
                console.log(res.url);
                counter = counter + 1;
                console.log("initial counter" + counter);
                if(counter == size){
                  console.log(counter);
                callback(imgarray);
              }
            });
            }
            
 }
 

 exports.createProduct = function(req, res){
      console.log(req.files);
      console.log(req.files[0].path);
      cloudUpload(req, res, function( imgarray){
        
            var product = new Product();
            var price = {};
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
            product.images = imgarray;
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


function createStore(req, res){
  var store = new Store();
  var address = {};
  item = req.body;
            store.name = item.name;
            address = item;
            store.address = address;
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

              }
            });
            readStore(req, res);
}
exports.createStoreData = createStore;
exports.readProductsData = readProducts;
exports.updateProductData = updateProduct;
exports.deleteProductData = deleteProduct;
exports.editProductData = editProduct;

