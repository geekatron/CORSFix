/**
 * Created with WebStorm.
 * Date: 1/27/2014
 * Time: 10:02 PM
 * @author Adam C. Nowak
 * @description
 */

/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global $, jQuery, _, ko, Mustache */
/*global sip */
'use strict';


var org = {};
//Namespace for Geekatron
org.geekatron = {};

//Namespace for Configuration
org.geekatron.Configuration = function (args) {
    var corsFix = 'cors.geekatron.org',
        corsBad = 'badcors.geekatron.org';

    this.getEndPoints = function () {
        var endpoints = {
                services : {
                    cors : {
                        good : corsFix,
                        bad : corsBad
                    }
                }
            };
        return endpoints;
    } //END getEndPoints
}; //END Configuration

//Create an instance of Configuration
org.geekatron.config = new org.geekatron.Configuration(null);

//Namespace for Integration
org.geekatron.integration = {};
//Namespace for Integration of RESTful services
org.geekatron.integration.rest = {};

//Namespace for the Sample RESTful service
org.geekatron.integration.rest.sample = {};
//Namespace for the CORS enabled service
org.geekatron.integration.rest.sample.good = {};
org.geekatron.integration.rest.sample.good.get = function (callback) {
    var endpoints = org.geekatron.config.getEndPoints(),
        url_base = "http://" + endpoints.services.cors.good,
        url_resource = '/sample/',
        url = url_base + url_resource;

    var request = $.ajax(
        {
            url : url,
            type : 'GET',
//            data : JSON.stringify(data),
            contentType : 'application/json; charset=utf-8',
            dataType : 'json',
            headers : {
                'Accept' : 'application/json'
            }
        }
    );

    request.done(function (result) {
        callback(undefined, result);
    });
    request.always(function (result) {

    });
    request.fail(function (XHR, textStatus, errorThrown) {
        console.log("Error! " + textStatus + ':' + errorThrown);
        //Create an Error Object
        var error = { responseText : XHR.responseText, status : XHR.status, statusText : XHR.statusText };
        //Pass back the Error
        callback(error);
    });
};
//Namespace for the CORS disabled service
org.geekatron.integration.rest.sample.bad = {};
org.geekatron.integration.rest.sample.bad.get = function (callback) {
    var endpoints = org.geekatron.config.getEndPoints(),
        url_base = "http://" + endpoints.services.cors.bad,
        url_resource = '/sample/',
        url = url_base + url_resource;

    var request = $.ajax(
        {
            url : url,
            type : 'GET',
//            data : JSON.stringify(data),
            contentType : 'application/json; charset=utf-8',
            dataType : 'json',
            headers : {
                'Accept' : 'application/json'
            }
        }
    );

    request.done(function (result) {
        callback(undefined, result);
    });
    request.always(function (result) {

    });
    request.fail(function (XHR, textStatus, errorThrown) {
        console.log("Error! " + textStatus + ':' + errorThrown);
        //Create an Error Object
        var error = { responseText : XHR.responseText, status : XHR.status, statusText : XHR.statusText };
        //Pass back the Error
        callback(error);
    });
};

//Namespace for Utility functions
org.geekatron.util = {};
//Namespace for Utilities related to date
org.geekatron.util.date = {};
//Namespace for computing the Current Year (4 digits)
org.geekatron.util.date.currentYear = function () {
    return new Date().getFullYear();
};

//Namespace for the ViewModel
org.geekatron.viewmodel = {};
//Namespace for the Sample Viewmodel (Knockout.js)
org.geekatron.viewmodel.Sample = function (args) {
    var self = this;
    /* View related observables */
    self.good = ko.observable();
    self.bad = ko.observable();

    self.updateGoodTerminal = function (message) {
        $("#goodterminal").append("<p>good CORS$ " + message + "</p>");
    };

    self.updateBadTerminal = function (message) {
        $("#badterminal").append("<p>bad CORS$ " + message + "</p>");
    };

    /* Initialize the View Model */
    (function () {
        function handleGoodResponse(err, data) {
            if (!_.isNull(err) && !_.isUndefined(err)) {
                //Handle Error Case
                console.log(err);
            } else {
                //Handle Success Case
                console.log("Success retrieving request from CORS patched server! Data object:");
                console.log(data);
                //Update the Terminal Prompt
                self.updateGoodTerminal("SUCCESS retrieving request from CORS patched server!!!");
                self.updateGoodTerminal("Message response as string:");
                self.updateGoodTerminal(JSON.stringify(data));
                self.updateGoodTerminal("Please use the Developer Console to see the see & play with the result...");
                self.updateGoodTerminal("exit");
                self.updateGoodTerminal("[Process completed]|");
            }

        }//END handleGoodResponse

        function handleBadResponse (err, data) {
            if (!_.isNull(err) && !_.isUndefined(err)) {
                //Handle Error Case
                console.log("ERROR retrieving request from un-patched server! Data object:");
                console.log(err);
                //Update the Terminal Prompt
                self.updateBadTerminal("ERROR retrieving request from un-patched server!!!");
                self.updateBadTerminal("Error message response as string:");
                self.updateBadTerminal(JSON.stringify(err));
                self.updateBadTerminal("Please use the Developer Console to see the see & play with the result...");
                self.updateBadTerminal("exit");
                self.updateBadTerminal("[Process completed]|");
            } else {
                //Handle Success Case
                //Hilarious as it's not going to happen while browsers handle the CORS case
                console.log(data);
            }
        }//END handleBadResponse

        //Update the Content of the Good CORS div
        self.updateGoodTerminal("Initiating request to patched server (CORS enabled)...");
        //Update the Content of the Bad CORS div
        self.updateBadTerminal("Initiating request to un-patched server (CORS disabled)...");

        //Issue the sample GET request to the Good CORS service
        org.geekatron.integration.rest.sample.good.get(handleGoodResponse);
        //Issue the sample GET request to the Bad CORS service
        org.geekatron.integration.rest.sample.bad.get(handleBadResponse);
    }());
};