/**
 * Created with WebStorm.
 * Date: 1/27/2014
 * Time: 1:52 PM
 * @author Adam C. Nowak
 * @description
 */

/*jslint node: true */

"use strict";

module.exports = function (app, express) {
    /*  =====================================
                ERROR HANDLING
     ===================================== */

    //Handle 400 and 500 pages here
    //.....
    //handle404
    //handle500

    /*  =====================================
            Application Configuration
     ===================================== */

    //Default configuration
    app.configure(function () {
        app.use(express.bodyParser());
        app.use(express.logger());
        app.use(express.methodOverride());
        //Setup the routes
        app.use(app.router);
        app.use('/style', express.static('public/assets/css'));
        app.use('/img', express.static('public/assets/img'));
        app.use('/images', express.static('public/assets/images'));
        app.use('/fonts', express.static('public/assets/fonts'));
        app.use('/js/app', express.static('public/js/app'));
        app.use('/js/lib', express.static('public/js/lib'));
        //Setup the handling of Errors e.g. 404 and 500 requests
        //app.use(handle404);
        //app.use(handle500);
    });

    //Named Configuration - Development
    app.configure('development', function() {
        app.use(express.bodyParser());
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
        app.use(express.methodOverride());
        //Setup the routes
        app.use(app.router);
        app.use('/style', express.static('public/assets/css'));
        app.use('/img', express.static('public/assets/img'));
        app.use('/images', express.static('public/assets/images'));
        app.use('/fonts', express.static('public/assets/fonts'));
        app.use('/js/app', express.static('public/js/app'));
        app.use('/js/lib', express.static('public/js/lib'));
        //Setup the handling of Errors e.g. 404 and 500 requests
        //app.use(handle404);
        //app.use(handle500);
    });


};//END module.exports


