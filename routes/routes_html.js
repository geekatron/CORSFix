/**
 * Created with WebStorm.
 * Date: 1/27/2014
 * Time: 3:06 PM
 * @author Adam C. Nowak
 * @description
 */

/*jslint node: true */

"use strict";

//SIP required artifacts
var routing_error = require('../libs/utils/routing/routing_error'),
    env = require('../libs/config/endpoint.js'),
    TemplateData = require('../libs/template/templatedata'),
    template = require('../views/template'),
    MongoClient = require('mongodb').MongoClient,
    format = require('util').format;
//template = require('../views/template/template'),

//Include npm modules
var _ = require("underscore"),
    httpProxy = require('http-proxy'),
    fs = require('fs'),
    Mustache = require('mustache'),
    S = require('string'),
    bcrypt = require('bcrypt'),
    nodemailer = require("nodemailer"),

//Required by Passport-openam
    passport = require('passport'),
    transport = null;

module.exports = function (app) {
    var error = Object.create(routing_error),
        templatedata = new TemplateData();

    /************************************************************
     *              HELPER FUNCTIONALITY
     *************************************************************/

    function logReqInfo(slug, resource, path, file) {
//        console.log("Requested element: " + slug);
//        console.log("Requested resource: " + resource);
//        console.log("Requested path: " + path);
//        console.log("Requested file: " + file);
    }

    function logReqHeader(req) {
        console.log("Request User Agent:" + JSON.stringify(req.headers['user-agent']));
        console.log("Request User:" + JSON.stringify(req.headers['user']));
        console.log("Request Cookie:" + JSON.stringify(req.headers['cookie']));
        console.log("Request Authorization:" + JSON.stringify(req.headers['authorization']));

        console.log("Request Header: " + JSON.stringify(req.headers));
        console.log("Request Body: " + JSON.stringify(req.body));

        console.log("Request Prarams:" + JSON.stringify(req.params));
        console.log("Request Cookies:" + JSON.stringify(req.headers['cookies']));
    }


    /************************************************************
     *  FUNCTIONALITY RELATED TO routing HTML content
     *************************************************************/
    app.get("*", function (req, res, next) {
        logReqHeader(req);

        if (_.isObject(req.session)) {
            var j_session = JSON.stringify(req.session);
            console.log("Request SESSION: " + j_session);
        }

        var j_session_keys = req.session.keys;
        console.log("Request SESSION KEYS: " + j_session_keys);

        next();
    });

    /* Root route before being sent to the next route */
    app.get('/', function (req, res) {
        //Setup the Data for the Mustache Template
        var data = templatedata.data.home,
            html,
            debug = req.query.debug;

        data.global = templatedata.data.global;
        //data.user = req.user;

        if (debug === "true") {
            res.cookie('userprofile', sampleSessionData, { maxAge: 900000, httpOnly: false});
        } else {
            res.cookie('userprofile', req.user, { maxAge: 900000, httpOnly: false});
        }

        html = Mustache.render(template.sip.home.page, data);
        res.send(html);
    });

    /************************************************
     *  Route definitions:                          *
     *      /index.html                             *
     *      /ipp/ - Interview Prep Profile          *
     *      /cp/ - Company Profile                  *
     *      /admin/ - Administration                *
     *      /config/ - User Account Configuration   *
     *      /logout/ - Logout of the User Account   *
     **************************************************/

    /************************************************************
     *  Routes that do not require authentication!              *
     *************************************************************/

    /* Test Route - Returns the configuration information for the Platform*/
    app.get('/configuration/', function (req, res) {
        var val = {'configuration': env.endpoint};
        res.send(val);
    });

//    /* Test Route - Returns user account information for the specified User Profile ID*/
//    app.get('/profile/:id', function (req, res) {
//        var userid = req.params.id,
//            val = {'configuration': env.endpoint};
//        //ice_p = new ICEP();
//
//
////        ice_p.profile.user.getProfile(userid, function(err, userprofile) {
////            console.log('User Profile: ' + JSON.stringify(userprofile));
////
////            res.send(userprofile);
////        });
//
//        res.send('USER PROFILE SAMPLE!');
//
//    });

    /* Test Route - Generate a hash for a password */
    app.get('/bcrypt/hash/:id', function (req, res) {
        var password = req.params.id;

        bcrypt.hash(password, 10, function (err, hash) {
            if (!_.isUndefined(err)) {
                res.send('Error hashing the password!!!');
            } else {
                res.send(hash);
            }
        });

    });
    /* Test Route - Compare password to hash */
    app.get('/bcrypt/compare/:id', function (req, res) {
        var password = req.params.id,
            hash = req.query.hash;

        bcrypt.compare(password, hash, function (err, data) {
            res.send(data);
        });
    });
    /* Test Route - Send test email through AWS SES */
    app.get('/mail/', function (req, res) {
        var mailOptions = {
            from : 'do-not-reply@pushupsforyourbrain.com',
            to : 'geekatron@gmail.com',
            subject : 'RE: Activate your new account',
            text : 'Welcome to the Self Improvement Platform. We have created a new user account for you and require you to go to the following link: http://sip.pushupsforyourbrain.com',
            html : '<div>Welcome to the <b>Self Improvement Platform (SIP)!</b></div><div>We have created a new user account for you and require you to go to the following link:</div><div><a href="http://sip.pushupsforyourbrain.com">Activate Here</a></div><div>Or copy the following link into your browser: http://sip.pushupsforyourbrain.com</div>'
        };

        if ( _.isNull(transport) || _.isUndefined(transport)) {
            transport = nodemailer.createTransport("SES", {
                AWSAccessKeyID : env.endpoint.aws.accessKeyId,
                AWSSecretKey : env.endpoint.aws.secretAccessKey
            });
        }

        function handleMailResponse(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log("Message sent: " + data.message);
            }

            // if you don't want to use this transport object anymore, uncomment following line
            //smtpTransport.close(); // shut down the connection pool, no more messages
        }

        transport.sendMail(mailOptions, handleMailResponse);

    });
    /* Test Route - Check connection with MongoHQ */
    app.get('/mongo/:collection/records/', function (req, res) {
        var collectionid = req.params.collection,
            collection = null;

        function handleDocuments(err, docs) {
            if (err) {
                return console.error(err)
            }
            res.send(docs);

        }

        function handleMongoClient(err, db) {
            if (err) {
                throw err;
            }
            console.log('Connected to database!');

            collection = db.collection(collectionid);

            collection.find({}).toArray(handleDocuments);
        }

        MongoClient.connect(process.env.MONGOHQ_URL, handleMongoClient);
    });

    //Route for the user to Sign Up
    //app.get('/signup/:slug', function (req, res) {
    app.get('/signup/', function (req, res) {
        var slug = [req.params.slug][0], // grab the page slug
            resource = req.params[0],
            path = 'app/',
            file = path + slug,
            html,
            params = req.params[0],
            data,
            debug = req.query.debug;

        logReqInfo(slug, resource, path, file);

        //Setup the Data for the Mustache Template
        data = templatedata.data.signup;
        data.global = templatedata.data.global;

        //Load up the promotion player template
        html = Mustache.render(template.sip.signup.page, data);
        res.send(html);

    });




    /************************************************************
     *  Routes that require authentication!                     *
     *************************************************************/
    /**
     * Route to display the index.html (Home Page)
     */
    app.get('/:slug', ensureAuthenticated, function (req, res, next) {
        var slug = [req.params.slug][0], // grab the page slug
            resource = req.params[0],
            path = 'app/',
            file = path + slug,
            html,
            params = req.params[0],
            data,
            debug = req.query.debug;

        logReqInfo(slug, resource, path, file);

        //Setup the Data for the Mustache Template
        data = templatedata.data.home;
        data.global = templatedata.data.global;
        //data.user = req.user;

        if (debug === "true") {
            res.cookie('userprofile', sampleSessionData, { maxAge: 900000, httpOnly: false});
        } else {
            res.cookie('userprofile', req.user, { maxAge: 900000, httpOnly: false});
        }

        if (slug === 'index.html') {
            //Load up the Homepage template
            html = Mustache.render(template.sip.home.page, data);
            res.send(html);
        } else {
            next();
        }

    });

    /**
     * Route to display the Interview Prep Profile (/ipp/index.html)
     */
    app.get('/ipp/:slug', ensureAuthenticated, function (req, res, next) {
        var slug = [req.params.slug][0], // grab the page slug
            resource = req.params[0],
            path = 'app/',
            file = path + slug,
            html,
            params = req.params[0],
            data,
            debug = req.query.debug;

        logReqInfo(slug, resource, path, file);

        //Setup the Data for the Mustache Template
        data = templatedata.data.ipp;
        data.global = templatedata.data.global;
        //data.user = req.user;

        if (debug === "true") {
            res.cookie('userprofile', sampleSessionData, { maxAge: 900000, httpOnly: false});
        } else {
            res.cookie('userprofile', req.user, { maxAge: 900000, httpOnly: false});
        }

        if (slug === 'index.html') {
            //Render the IPP Template Page
            html = Mustache.render(template.sip.ipp.page, data);
            res.send(html);
        } else {
            next();
        }

    });

    /**
     * Route to display the User Configuration (/config/index.html)
     */
    app.get('/config/:slug', ensureAuthenticated, function (req, res, next) {
        var slug = [req.params.slug][0], // grab the page slug
            resource = req.params[0],
            path = 'app/',
            file = path + slug,
            html,
            params = req.params[0],
            data,
            debug = req.query.debug;

        logReqInfo(slug, resource, path, file);

        //Setup the Data for the Mustache Template
        data = templatedata.data.config;
        data.global = templatedata.data.global;
        //data.user = req.user;

        if (debug === "true") {
            res.cookie('userprofile', sampleSessionData, { maxAge: 900000, httpOnly: false});
        } else {
            res.cookie('userprofile', req.user, { maxAge: 900000, httpOnly: false});
        }

        if (slug === 'index.html') {
            //Render the IPP Template Page
            html = Mustache.render(template.sip.uam.page, data);
            res.send(html);
        } else {
            next();
        }

    });

    /**
     * Route to display the Admin Configuration (/admin/config/index.html)
     */
    app.get('/admin/config/:slug', ensureAuthenticated, function (req, res, next) {
        var slug = [req.params.slug][0], // grab the page slug
            resource = req.params[0],
            path = 'app/',
            file = path + slug,
            html,
            params = req.params[0],
            data,
            debug = req.query.debug;

        logReqInfo(slug, resource, path, file);

        //Setup the Data for the Mustache Template
        data = templatedata.data.admin_config;
        data.global = templatedata.data.global;
        //data.user = req.user;

        if (debug === "true") {
            res.cookie('userprofile', sampleSessionData, { maxAge: 900000, httpOnly: false});
        } else {
            res.cookie('userprofile', req.user, { maxAge: 900000, httpOnly: false});
        }

        if (slug === 'index.html') {
            //Render the IPP Template Page
            html = Mustache.render(template.sip.uam.page, data);
            res.send(html);
        } else {
            next();
        }

    });

    /**
     * Route to display the Admin Homepage (/admin/index.html)
     */
    app.get('/admin/:slug', ensureAuthenticated, function (req, res, next) {
        var slug = [req.params.slug][0], // grab the page slug
            resource = req.params[0],
            path = 'app/',
            file = path + slug,
            html,
            params = req.params[0],
            data,
            debug = req.query.debug;

        logReqInfo(slug, resource, path, file);

        //Setup the Data for the Mustache Template
        data = templatedata.data.admin;
        data.global = templatedata.data.global;
        //data.user = req.user;

        if (debug === "true") {
            res.cookie('userprofile', sampleSessionData, { maxAge: 900000, httpOnly: false});
        } else {
            res.cookie('userprofile', req.user, { maxAge: 900000, httpOnly: false});
        }

        if (slug === 'index.html') {
            //Render the Admin Home Template Page
            html = Mustache.render(template.sip.admin.home.page, data);
            res.send(html);
        } else {
            next();
        }

    });

    /**
     * Route to display the Admin Company Profile Page (/admin/cp/index.html)
     */
    app.get('/admin/cp/:slug', ensureAuthenticated, function (req, res, next) {
        var slug = [req.params.slug][0], // grab the page slug
            resource = req.params[0],
            path = 'app/',
            file = path + slug,
            html,
            params = req.params[0],
            data,
            debug = req.query.debug;

        logReqInfo(slug, resource, path, file);

        //Setup the Data for the Mustache Template
        data = templatedata.data.admin_cp;
        data.global = templatedata.data.global;
        //data.user = req.user;

        if (debug === "true") {
            res.cookie('userprofile', sampleSessionData, { maxAge: 900000, httpOnly: false});
        } else {
            res.cookie('userprofile', req.user, { maxAge: 900000, httpOnly: false});
        }

        if (slug === 'index.html') {
            //Render the IPP Template Page
            html = Mustache.render(template.sip.admin.cp.page, data);
            res.send(html);
        } else {
            next();
        }

    });

    /**
     * Route to display the Admin Employee Profile Page (/admin/ep/index.html)
     */
    app.get('/admin/ep/:slug', ensureAuthenticated, function (req, res, next) {
        var slug = [req.params.slug][0], // grab the page slug
            resource = req.params[0],
            path = 'app/',
            file = path + slug,
            html,
            params = req.params[0],
            data,
            debug = req.query.debug;

        logReqInfo(slug, resource, path, file);

        //Setup the Data for the Mustache Template
        data = templatedata.data.admin_ep;
        data.global = templatedata.data.global;
        //data.user = req.user;

        if (debug === "true") {
            res.cookie('userprofile', sampleSessionData, { maxAge: 900000, httpOnly: false});
        } else {
            res.cookie('userprofile', req.user, { maxAge: 900000, httpOnly: false});
        }

        if (slug === 'index.html') {
            //Render the IPP Template Page
            html = Mustache.render(template.sip.admin.ep.page, data);
            res.send(html);
        } else {
            next();
        }

    });

    /**
     * Route to display the Admin Position Profile Page (/admin/cp/index.html)
     */
    app.get('/admin/pp/:slug', ensureAuthenticated, function (req, res, next) {
        var slug = [req.params.slug][0], // grab the page slug
            resource = req.params[0],
            path = 'app/',
            file = path + slug,
            html,
            params = req.params[0],
            data,
            debug = req.query.debug;

        logReqInfo(slug, resource, path, file);

        //Setup the Data for the Mustache Template
        data = templatedata.data.admin_pp;
        data.global = templatedata.data.global;
        //data.user = req.user;

        if (debug === "true") {
            res.cookie('userprofile', sampleSessionData, { maxAge: 900000, httpOnly: false});
        } else {
            res.cookie('userprofile', req.user, { maxAge: 900000, httpOnly: false});
        }

        if (slug === 'index.html') {
            //Render the IPP Template Page
            html = Mustache.render(template.sip.admin.pp.page, data);
            res.send(html);
        } else {
            next();
        }

    });

    /**
     * Route to display the Admin Multimedia Profile Page (/admin/mp/index.html)
     */
    app.get('/admin/mp/:slug', ensureAuthenticated, function (req, res, next) {
        var slug = [req.params.slug][0], // grab the page slug
            resource = req.params[0],
            path = 'app/',
            file = path + slug,
            html,
            params = req.params[0],
            data,
            debug = req.query.debug;

        logReqInfo(slug, resource, path, file);

        //Setup the Data for the Mustache Template
        data = templatedata.data.admin_mp;
        data.global = templatedata.data.global;
        //data.user = req.user;

        if (debug === "true") {
            res.cookie('userprofile', sampleSessionData, { maxAge: 900000, httpOnly: false});
        } else {
            res.cookie('userprofile', req.user, { maxAge: 900000, httpOnly: false});
        }

        if (slug === 'index.html') {
            //Render the IPP Template Page
            html = Mustache.render(template.sip.admin.mp.page, data);
            res.send(html);
        } else {
            next();
        }

    });

    /**
     * Route to display the Admin Position Profile Page (/admin/cp/index.html)
     */
    app.get('/admin/uam/:slug', ensureAuthenticated, function (req, res, next) {
        var slug = [req.params.slug][0], // grab the page slug
            resource = req.params[0],
            path = 'app/',
            file = path + slug,
            html,
            params = req.params[0],
            data,
            debug = req.query.debug;

        logReqInfo(slug, resource, path, file);

        //Setup the Data for the Mustache Template
        data = templatedata.data.admin_uam;
        data.global = templatedata.data.global;
        //data.user = req.user;

        if (debug === "true") {
            res.cookie('userprofile', sampleSessionData, { maxAge: 900000, httpOnly: false});
        } else {
            res.cookie('userprofile', req.user, { maxAge: 900000, httpOnly: false});
        }

        if (slug === 'index.html') {
            //Render the IPP Template Page
            html = Mustache.render(template.sip.admin.uam.page, data);
            res.send(html);
        } else {
            next();
        }

    });

};