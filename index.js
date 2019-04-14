const bowser = require('bowser');
const isbot = require('isbot');
const geoip = require('geoip-lite');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

exports.trackVisit = function(req) {

    var header = req.headers;
    var dnt = header['dnt'];
    var ua = header['user-agent'];
    var ip = header['x-forwarded-for'] ? header['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;
    var bot = isbot(ua);

    // Check DNT-header and detect bots
    if (dnt != '1' && bot != true & req.originalUrl != '/favicon.ico') {

        var client = bowser.getParser(ua);

        //Traffic source
        var path = req.originalUrl;
        var referer = header['referer'];

        // Client technology
        var browser = client.getBrowser();
        var os = client.getOS();
        var device = client.getPlatformType();

        //Client location
        var geo = geoip.lookup(ip);
        var country = geo['country'];
        var region = geo['region'];
        var city = geo['city'];

        //Create timestamp
        var timestamp = Math.floor(Date.now() / 1000);

        var data = [path, referer, browser, os, device, country, region, city, timestamp];

        //Track visit
        saveJSON(data);

    } else {

        // User does not consent to tracking
        // or might be a bot

    }

};

//Storage options:

saveJSON = function(data) {

  const adapter = new FileSync('visits.json')
  const db = low(adapter)

  db.defaults({ visits: [] })
      .write()

  db.get('visits')
      .push({
          path: data[0],
          referer: data[1],
          browser: data[2],
          os: data[3],
          device: data[4],
          country: data[5],
          region: data[6],
          city: data[7],
          timestamp: data[8]
      })
      .write()

};
