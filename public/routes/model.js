var mongoose = require('mongoose');
var relationship = require("mongoose-relationship");
var Schema  = mongoose.Schema;
mongoose.Promise = require('bluebird');

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

exports.Product = mongoose.model('Product',ProductSchema);
exports.Store = mongoose.model('Store',StoreSchema);

