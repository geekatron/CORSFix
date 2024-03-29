CORSFix
=======

Browsers enforce an extra level of security to prevent [Cross-origin resource sharing (CORS)](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) as per the same origin security policy. Often cross-origin resource sharing is a vector for attack, enabling malicious users to deploy a script from a remote origin/host, impeding the originally intended functionality. CORS enables JavaScript on a web page to make a XMLHttpRequest (XHR) to another domain/host, outside of the domain/host that the JavaScript originated from. For more information about CORS please check out the [W3C here](http://www.w3.org/TR/cors/).

The source is an example on how to get allow cross-origin XHR and prevent errors such as No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'www.abc.org' is therefore not allowed access. The example below is specifically geared towards a Node.js/Express.js web-server.

Please go to [corsui.geekatron.org](http://corsui.geekatron.org/) for a working example.


# Configuration for CORS Fix

Endpoint configuration driven by Environmental Variables. Please see below for more details.

## Environment Variables
### Sample Service Address
* CORS_FIX


## Node.js WebStorm Configuration
### Sample Project Configuration
* Name:
    + server.js
* Path to node:
    + /usr/local/bin/node
* Node Parameters:
    + --debug
* Working directory:
    + /Users/geekatron/workspace/Webstorm/Planet R&D/SIP
* Path to Node App JS File:
    + server.js
* Application Parameters:
    + N/A

#### Sample Environment Variables
* CORS_FIX
    + cors.geekatron.org


# Sample Deployment
## Deployment Architecture