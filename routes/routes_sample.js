/**
 * Created with WebStorm.
 * Date: 1/27/2014
 * Time: 2:37 PM
 * @author Adam C. Nowak
 * @description
 */

/*jslint node: true */
"use strict";

var routing_error = require('../libs/utils/routing/routing_error'),
    env = require('../libs/config/endpoint.js'),
    format = require('util').format,

//Include npm modules
    _ = require("underscore"),
    S = require('string'),
    transport = null;

module.exports = function (app) {
    var error = Object.create(routing_error);

    /************************************************************
     *              HELPER FUNCTIONALITY
     *************************************************************/
    /**
     * Simple route middleware to ensure user is authenticated.
     * Use this route middleware on any resource that needs to be protected. If the request
     * is authenticated (typically via a presistent Login session), the request will proceed.
     * Otherwise, the user will be redirected to the Login page.
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }


        res.redirect('/login/');
    }

    /************************************************************
     *  FUNCTIONALITY RELATED TO the Sample
     *************************************************************/

    /************************************************************
     *  Routes that do not require authentication!              *
     *************************************************************/

    app.get('/sample/', function (req, res) {
        res.send(200, {
            type : "profile#sample",
            url : process.env.CORS_FIX + '/sample/',
            data : "Welcome to the CORS Fix sample page!"
        });
    });

    app.post('/sample/', function (req, res) {
        var body = req.body,
            fname, lname;

        if ( !_.isNull(body) && !_.isUndefined(body) ) {
            fname = body.firstname;
            lname = body.lastname;
        } else {
            //return an error
        }

    });

    /************************************************************
     *  Routes that require authentication!                     *
     *************************************************************/

//    app.get('/sample/', ensureAuthenticated, function (req, res) {
//
//    });
//
//    app.post('/sample/', ensureAuthenticated, function (req, res) {
//
//    });


};