/** @param header The postal code */

const bowser = require('bowser');
const isbot = require('isbot');
const geoip = require('geoip-lite');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

exports.trackVisit = function (header, ip) {

  var dnt = header['dnt'];
  var ua = header['user-agent'];
  var ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;
  var bot = isbot(ua);

  // Check DNT-header and detect bots
  if (dnt != '1' && bot != true) {

    var client = bowser.getParser(ua);

    // Client technology
    var browser = client.getBrowser();
    var os = client.getOS();
    var device = client.getPlatformType();
    var timestamp = Math.floor(Date.now() / 1000);

    //Client location
    var geo = geoip.lookup(ip);
    var country = geo['country'];
    var region = geo['region'];
    var city = geo['city'];

    //Track visit
    var visit = [browser, os, device, country, region, city, timestamp];
    console.log(visit);

  } else {

    // User does not consent to tracking
    // or might be a bot

  }

};
