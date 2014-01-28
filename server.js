/**
 * Created with WebStorm.
 * Date: 1/27/2014
 * Time: 1:37 PM
 * @author Adam C. Nowak
 * @description
 */

/*jslint node: true */

"use strict";


/**
 *  Module Dependencies
 */
var express = require('express'),
    env = require('./libs/config/endpoint'),
    http = require('http'),
    path = require('path'),
    app = express();

/*
 ===============================================================
 Express Session Setup
 ===============================================================
 */

var app = module.exports = express(),
    processport = process.env.PORT || 5050;

global.debug = (process.env.DEBUG_MODE === 'true') || false;

//Include the Environment Module
require('./libs/config/environment.js')(app, express);

/** Routes for the CORS Fix */
//Route to support CORS
require('./routes/routes_cors')(app);
//Route for HTML content
//require('./routes/routes_html')(app);
//Route for the test service - RESTful Sample
require('./routes/routes_sample')(app);

// start server
app.listen(processport);

//Print out the port on startup
console.log("Port (process.env.PORT): " + processport);
console.log("Port for node.js process: " + app.get('port'));
console.log('APP Address: ' + app.get('address'));