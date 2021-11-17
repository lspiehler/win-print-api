const powershell = require('../../lib/powershell');
const config = require('../../config');
const fs = require('fs');

var cachedresp;
var reqcallbacks = [];

var getPortData = function(params, callback) {
    if(config.USEFILES) {
        fs.readFile('./exports/ports.json', 'utf8', function(err, data) {
            if(err) {
                callback(err, false);
            } else {
                callback(err, data);
            }
        });
    } else {
        let cmd = 'Get-PrinterPort | ConvertTo-Json'
        if(config.USEWMI) {
            cmd = 'Get-WmiObject -Query "SELECT * FROM Win32_TCPIPPrinterPort" | ConvertTo-Json';
        }
        powershell.runCommand({ cmd: cmd }, function(err, portresp) {
            if(err) {
                callback(err, false);
            } else {
                callback(false, portresp.stdout.toString());
            }
        });
    }
}

module.exports = function(params, callback) {
    if(cachedresp && params.updatecache != true) {
        callback(false, cachedresp);
    } else {
        if(reqcallbacks.length == 0) {
            cachedresp = false;
            reqcallbacks.push(callback);
            getPortData(params, function(err, portresp) {
                if(err) {
                    while(reqcallbacks.length >= 1) {
                        let cb = reqcallbacks.shift();
                        cb(err, fa);
                    }
                } else {
                    let ports = JSON.parse(portresp);
                    cachedresp = {};
                    for(let i = 0; i <= ports.length - 1; i++) {
                        /*if(cachedresp.hasOwnProperty(ports[i].name)) {

                        }*/
                        delete ports[i].CimSystemProperties;
                        delete ports[i].CimInstanceProperties;
                        delete ports[i].CimClass;
                        cachedresp[ports[i].Name] = ports[i];
                    }
                    
                    while(reqcallbacks.length >= 1) {
                        let cb = reqcallbacks.shift();
                        cb(false, cachedresp);
                    }
                }
            });
        } else {
            reqcallbacks.push(callback);
        }
    }
}