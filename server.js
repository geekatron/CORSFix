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
    routes = require('./routes'),
    user = require('./routes/user'),
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
//Route for the test service
require('./libs/')(app);

//Get the address without http
