const powershell = require('../../lib/powershell');
const port = require('../port');
const config = require('../../config');

var cachedresp;
var reqcallbacks = [];

var finalizeRequest = function(ports, printers) {
    if(!ports) {
        //console.log('ports haven\'t completed yet');
        return false;
    }
    if(!printers) {
        //console.log('printers haven\'t completed yet');
        return false;
    }
    let keys = Object.keys(printers);
    let ipprop = 'PrinterHostAddress';
    if(config.USEWMI) {
        ipprop = 'HostAddress'
    }
    for(let i = 0 ; i <= keys.length - 1; i++) {
        if(ports.hasOwnProperty(printers[keys[i]].PortName)) {
            if(ports[printers[keys[i]].PortName].hasOwnProperty(ipprop)) {
                printers[keys[i]]['PrinterHostAddress'] = ports[printers[keys[i]].PortName][ipprop];
            } else {
                printers[keys[i]]['PrinterHostAddress'] = null;
            }
        }
    }
    //console.log(printers);
    cachedresp = printers;
    while(reqcallbacks.length >= 1) {
        let cb = reqcallbacks.shift();
        cb(false, printers);
    }
}

var getPorts = function(params, callback) {
    port.list({ updatecache: params.updatecache }, function(err, portresp) {
        if(err) {
            callback(err, false);
        } else {
            callback(false, portresp);
        }
    });
}

var getPrinters = function(params, callback) {
    let cmd = 'Get-Printer | ConvertTo-Json'
    if(config.USEWMI) {
        cmd = 'Get-WmiObject -Query "SELECT * FROM Win32_Printer" | ConvertTo-Json';
    }
    powershell.runCommand({ cmd: cmd }, function(err, printresp) {
        if(err) {
            callback(err, false);
        } else {
            let ports = JSON.parse(printresp.stdout.toString());
            let printers = {};
            let usewmi = false;
            if(config.USEWMI) {
                usewmi = true;
            }
            for(let i = 0; i <= ports.length - 1; i++) {
                /*if(cachedresp.hasOwnProperty(ports[i].name)) {

                }*/
                delete ports[i].CimSystemProperties;
                delete ports[i].CimInstanceProperties;
                delete ports[i].CimClass;
                printers[ports[i].Name] = ports[i];
                printers[ports[i].Name]['useWMI'] = usewmi;
            }
            callback(false, printers);
        }
    });
}

module.exports = function(params, callback) {
    if(cachedresp && params.updatecache != true) {
        callback(false, cachedresp);
    } else {
        var ports;
        var printers;
        if(reqcallbacks.length == 0) {
            cachedresp = false;
            reqcallbacks.push(callback);
            getPorts({ updatecache: params.updatecache }, function(err, portresp) {
                if(err) {
                    while(reqcallbacks.length >= 1) {
                        let cb = reqcallbacks.shift();
                        cb(err, false);
                    }
                    return;
                } else {
                    ports = portresp;
                    finalizeRequest(ports, printers);
                }
            });
            getPrinters({}, function(err, printresp) {
                if(err) {
                    while(reqcallbacks.length >= 1) {
                        let cb = reqcallbacks.shift();
                        cb(err, false);
                    }
                    return;
                } else {
                    printers = printresp;
                    finalizeRequest(ports, printers);
                }
            });
        } else {
            reqcallbacks.push(callback);
        }
    }
}