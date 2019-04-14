const bowser = require('bowser');
const isbot = require('isbot');
const geoip = require('geoip-lite');

module.exports = function(options) {

  var dbEnabled = options.enableMongo;
  var connection = options.connection;

  return {

    trackVisit: function(req) {

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

          //Create visit array
          var data = [path, referer, browser, os, device, country, region, city];

          //Track visit
          if (dbEnabled == true && connection.length > 0) {
            module.exports.saveMongo(data);
          } else {
            module.exports.saveJSON(data);
          };

        } else {}

    },

    //Storage options:

    saveJSON: function(data) {

      const low = require('lowdb');
      const FileSync = require('lowdb/adapters/FileSync');
      const adapter = new FileSync('visits.json');
      const db = low(adapter);

      db.defaults({ visits: [] })
          .write()

      //Create timestamp
      var timestamp = Math.floor(Date.now() / 1000);

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
              timestamp: timestamp
          })
          .write()

    },

    saveMongo: function(data) {

      var mongoose = require('mongoose');
      mongoose.connect(connection, {useNewUrlParser: true});

      var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', function() {
        // we're connected!
      });

      var object = mongoose.model('visit', {
          path: String,
          referer: String,
          browser: [{ name: String, version: String }],
          os: [{ name: String, version: String }],
          device: String,
          country: String,
          region: String,
          city: String
      }, {
        timestamps: true
      });

      var visit = new object({
          path: data[0],
          referer: data[1],
          browser: data[2],
          os: data[3],
          device: data[4],
          country: data[5],
          region: data[6],
          city: data[7]
      });

      visit.save(function (err, visit) {
        if (err) return console.error(err);
      });

    }

  };

};
