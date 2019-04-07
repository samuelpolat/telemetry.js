const bowser = require('bowser');
const isbot = require('isbot');
const geoip = require('geoip-lite');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('visits.json')
const db = low(adapter)

db.defaults({
        visits: [],
        count: 0
    })
    .write()

exports.trackVisit = function(req) {

    var header = req.headers;
    var dnt = header['dnt'];
    var ua = header['user-agent'];
    var ip = header['x-forwarded-for'] ? header['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;
    var bot = isbot(ua);

    // Check DNT-header and detect bots
    if (dnt != '1' && bot != true) {

        var client = bowser.getParser(ua);

        // Client technology
        var browser = client.getBrowser();
        var os = client.getOS();
        var device = client.getPlatformType();

        //Client location
        var geo = geoip.lookup(ip);
        var country = geo['country'];
        var region = geo['region'];
        var city = geo['city'];

        //Add timestamp
        var date = new Date();
        yr = date.getUTCFullYear();
        mo = date.getUTCMonth()+1;
        dy = date.getUTCDate();
        hr = date.getUTCHours();
        mn = date.getUTCMinutes();
        var timestamp = {"year": yr, "month": mo, "day": dy, "hr": hr, "min": mn};

        //Track visit
        db.get('visits')
            .push({
                browser: browser,
                os: os,
                device: device,
                country: country,
                region: region,
                city: city,
                timestamp: timestamp
            })
            .write()

        db.update('count', n => n + 1)
            .write()

    } else {

        // User does not consent to tracking
        // or might be a bot

    }

};
