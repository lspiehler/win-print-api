const powershell = require('../../../lib/powershell');

var cachedresp;
var reqcallbacks = [];

module.exports = function(params, callback) {
    if(cachedresp && params.updatecache != true) {
        let resp = {
            status: 200,
            headers: [],
            body: {
                result: 'success',
                message: null,
                data: cachedresp
            }
        }

        callback(false, resp);
    } else {
        if(reqcallbacks.length == 0) {
            cachedresp = false;
            reqcallbacks.push(callback);
            powershell.runCommand({ cmd: 'Get-PrinterPort | ConvertTo-Json' }, function(err, portresp) {
                if(err) {
                    callback(err, false);
                } else {
                    let ports = JSON.parse(portresp.stdout.toString());
                    cachedresp = {};
                    for(let i = 0; i <= ports.length - 1; i++) {
                        /*if(cachedresp.hasOwnProperty(ports[i].name)) {

                        }*/
                        delete ports[i].CimSystemProperties;
                        delete ports[i].CimInstanceProperties;
                        delete ports[i].CimClass;
                        cachedresp[ports[i].Name] = ports[i];
                    }
                    //console.log(cachedresp);

                    let resp = {
                        status: 200,
                        headers: [],
                        body: {
                            result: 'success',
                            message: null,
                            data: cachedresp
                        }
                    }

                    while(reqcallbacks.length >= 1) {
                        let cb = reqcallbacks.shift();
                        cb(false, resp);

                    }
                }
            });
        } else {
            reqcallbacks.push(callback);
        }
    }
}