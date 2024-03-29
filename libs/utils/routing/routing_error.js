/**
 * Created with WebStorm.
 * Date: 1/27/2014
 * Time: 2:32 PM
 * @author Adam C. Nowak
 * @description
 */

"use strict";

var RoutingError = {
    error: function (req, res, status, msg, err) {
        //respond with html page
        if (req.accepts('html')) {
            res.status(status);
            //res.send(status, msg);
            res.send(status, {url: req.url});
            //Used if you want to render an HTML Error page
            //res.render(status, {url: req.url});
        }
        //respond with json
        if (req.accepts('json')) {
            res.status(status);
            res.send({error: msg});
        } else {
            //default to plain-text. send()
            res.type('txt');
            res.status(status);
            res.send(msg);
        }

        return;
    }//END error
};
module.exports = RoutingError;