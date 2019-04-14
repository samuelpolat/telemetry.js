var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var visitSchema = new mongoose.Schema({
  path: String,
  referer: String,
  browser: [{ name: String, version: String }],
  os: [{ name: String, version: String }],
  device: String,
  country: String,
  region: String,
  city: String,
  timestamp: Number
});

module.exports = mongoose.model('visits', userSchema);
