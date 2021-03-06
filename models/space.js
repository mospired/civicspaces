var mongoose = require('mongoose');
var createdDate = require('../plugins/createdDate');
var cleanString = require('../helpers/cleanString');
var validEmail = require('../helpers/validate/email');

var schema = mongoose.Schema({
  //primary required properties
  address: { type: String, required: true, trim: true },
  city: { type: String, trim: true },
  zip: { type: String, required: true, trim: true },
  contact: { type: String, lowercase: true, required: true, trim: true },
  //map coordinates [lat, lng]
  geo: { 
    lat: Number,
    lng: Number
  },
  //secondary properties
  type: { type: String, enum: ['Storefront', 'Office Only', 'Loft/Mixed Use', 'Land/Property']},
  leaseLength: { type: String, enum: ['Single-day Use', 'Multi-day Use', 'Multi-week Use', 'Long-term Use']},
  area: {type:Number},
  maxOccupants: {type:Number},
  allowed: {
    foodBev: {type:Boolean},
    alcohol: {type:Boolean},
    music: {type:Boolean},
    modifications: {type:String, enum: ['None', 'Non-intrusive', 'Intrusive']}
  },
  amenities: {
    wifi: {type:Boolean},
    parkingOnSite: {type:Boolean},
    handicap: {type:Boolean},
    furnished: {type:Boolean},
    bathroom: {type:String, enum: ['None', 'Single', 'Multiple']},
    kitchen: {type:String, enum: ['None', 'Partial', 'Full']}
  },
  description: {type:String},
  images: [
    {
      cloudinary_id: String
    }
  ]
})

schema.statics.updateProperty = function(req, callback) {
  var id = req.param('_id');
  var query = {_id: id};
  var property = req.param('property');
  var value = req.param('value');
  var update = {}
  update[property] = value;

  //update the model
  this.update(query, update, function(err, affected) {
    if (err) return callback(err);
    if (0 === affected) return callback(new Error('No Space to modify.'));
    callback();
  })
}

schema.statics.edit = function(req, callback) {
  var id = req.param('id');
  var author = req.session.user;
  // @TODO handle cases where editing is done by authors vs admins (who can edit spaces they don't own )
  //var query = { _id: id, contact: author };
  var query = { _id: id };
  var update = {};
  if (req.param('address')) update.address = cleanString(req.param('address'));
  if (req.param('city')) update.city = cleanString(req.param('city'));
  if (req.param('zip')) update.zip = cleanString(req.param('zip'));
  if (req.param('contact')) update.contact = author;
  //optional
  if (req.param('type').length > 0) update.type = req.param('type');
  if (req.param('leaseLength').length > 0) update.leaseLength = req.param('leaseLength');
  if (req.param('area').length > 0) update.area = req.param('area');
  if (req.param('maxOccupants').length > 0) update.maxOccupants = req.param('maxOccupants');
  //allowed
  update.allowed = {};
  update.allowed.foodBev = true ? req.param('allowedFood') == 'on' : false;
  update.allowed.alcohol = true ? req.param('allowedAlcohol') == 'on' : false;
  update.allowed.music = true ? req.param('allowedMusic') == 'on' : false;
  if (req.param('allowedMods')) update.allowed.modifications = req.param('allowedMods');
  //amenities
  update.amenities = {};
  update.amenities.wifi = true ? req.param('wifi') == 'on' : false;
  update.amenities.parkingOnSite = true ? req.param('parking') == 'on' : false;
  update.amenities.handicap = true ? req.param('handicap') == 'on' : false;
  update.amenities.furnished = true ? req.param('furnished') == 'on' : false;
  if (req.param('bathroom')) update.amenities.bathroom = req.param('bathroom');
  if (req.param('kitchen')) update.amenities.kitchen = req.param('kitchen');
  //description
  if (req.param('description').length > 0) update.description = req.param('description');

  //update the model
  this.update(query, update, function(err, affected) {
    if (err) return callback(err);
    if (0 === affected) return callback(new Error('No Space to modify.'));
    callback();
  })
}

schema.plugin(createdDate);

module.exports = mongoose.model('Space', schema);
