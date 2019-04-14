

# Telemetry.js
>🎲 Privacy-friendly visit tracking for Node.js

[![NPM](https://nodei.co/npm/telemetry.js.png)](https://nodei.co/npm/telemetry.js/)

![GitHub file size in bytes](https://img.shields.io/github/size/samuelpolat/telemetry.js/index.js.svg) ![npm](https://img.shields.io/npm/v/telemetry.js.svg)  ![npm](https://img.shields.io/npm/dt/telemetry.js.svg) ![GitHub](https://img.shields.io/github/license/samuelpolat/telemetry.js.svg)

## Highlights

 - **<4kb** visit tracking library without database
 - 100% server-side
 - 100% open-source
 - MongoDB support
 - Detects & ignores bots
 - Privacy-friendly at its core
 - GDPR-compliant

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Install

    $ npm install telemetry.js

## Usage

    var telemetry = require('telemetry.js');

Track visits with:

    telemetry.trackVisit(req);

That's it! Add this line of code before you respond to a request and it will track every request to the `visits.json` file.

### How it works

Unlike other web analytics tools (e.g. Google Analytics), Telemetry does not work in the visitor's browser. Instead it parses the  [HTTP request header](https://developer.mozilla.org/en-US/docs/Glossary/Request_header) and works fully server-side.

When a user sends a request, your server processes the request header through the `trackVisit()` function.

Telemetry then reads the client user agent, including *browser*, *operating system* & *device type*, and saves the parsed information as a visit to the `visits.json` file.

For every request, Telemetry creates a visit with a lot of useful information.

- **traffic source**  - path and referer
- **technology**  - browser, OS, and device type
- **location**  - country, region, and city

This is how a visit usually looks like in your `visits.json` file:

    {
          "path": "/products",
          "referer": "https://bitly.com/",
          "browser": {
            "name": "Safari",
            "version": "12.0.2"
          },
          "os": {
            "name": "macOS",
            "version": "10.14.2"
          },
          "device": "desktop",
          "country": "US",
          "region": "CA",
          "city": "San Francisco",
          "timestamp": 1554076800
        }

### Privacy Fundamentals

Telemetry ***does not collect any personal information*** and thus it does not save client's IP addresses. Instead, it looks up the client's location (country, region & city) via the `geoip-lite` [library](https://www.npmjs.com/package/geoip-lite) without actually saving the IP address.

Many web browsers give users the option to signal their tracking preferences with the [Do Not Track](https://www.eff.org/issues/do-not-track) request header. Operators are not obliged to comply with that request, however Telemetry complies with DNT-requests and ignores those visitors.

## Using MongoDB

Using the `visits.json` to keep track of visits might be enough for small-scale websites and applications. A single log usually takes 300B of storage and thus the log can grow very quickly, if you run an application with heavy traffic.

Telemetry offers the options to save tracked visits to a MongoDB database instead of the `visits.json` file. This option is much more scalable and easy to set up.

Initialize Telemetry:

    var telemetry = require('telemetry.js');
    telemetry = telemetry({enableMongo: false, connection: 'mongodb://user:password@host:port'});

You can track visits as usual with:

    telemetry.trackVisit(req);


## What's Next?

- [x] Alternative Storage
- [x] Track referrers  
- [ ] Visual dashboard
- [ ] Event tracking
