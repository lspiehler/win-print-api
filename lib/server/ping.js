const http = require('../http');
const config = require('../../config');
const fs = require('fs');

var ca;

var getCA = function() {
    if(ca) {
        return ca;   
    } else {
        ca = fs.readFileSync(require('path').join(__dirname, '../../cert/trust.pem')).toString()
        return ca;
    }
}

var getOptions = function() {
    //console.log(new URL(config.MANAGEMENTURL));
    /*let splitstr = config.MANAGEMENTURL.split(':');
    console.log(splitstr.length);
    console.log(splitstr[0]);
    console.log(splitstr[1]);

    let protocol = splitstr[0];
    let port = 80;
    if(protocol=='https') {
        port = 443;
    }
    if(splitstr.length==3) {
        port = splitstr[2];
    }
    let host = splitstr[1].replace('//', '');

    let options = {
        host: host,
        protocol: protocol,
        port: port,
        path: '/api/server/inventory/ping',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }*/

    let url = new URL(config.MANAGEMENTURL);

    /*console.log('test');
    console.log(options.hostname);

    options.method = 'POST';
    options.pathname = '/api/server/inventory/ping';
    options.headers = {
        'Content-Type': 'application/json'
    }*/

    //console.log(getCA());

    let options = {
        host: url.host,
        protocol: url.protocol,
        ca: getCA(),
        port: url.port,
        path: '/api/server/inventory/ping',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return options;
}

module.exports = function(callback) {
    let name = config.HOSTNAME;
    if(config.DOMAIN) {
        name = name + '.' + config.DOMAIN;
    }

    let body = {
        name: name,
        port: config.LISTENPORT
    }
    http.request({ options: getOptions(), body: body }, function(err, resp) {
        if(err) {
            callback(err, false);
        } else {
            callback(false, resp);
        }
    });
}