const powershell = require('../../../lib/powershell');

module.exports = function(params, callback) {
    if(params.hasOwnProperty('ip')==false) {
        callback('Request must contain an ip property', false);
        return;
    }
    let ip = params.ip
    let name;
    if(params.hasOwnProperty('name')==false) {
        name = ip;
    } else {
        name = params.name;
    }
    powershell.runCommand({ cmd: 'Add-PrinterPort -Name "' + name + '" -PrinterHostAddress "' + ip + '"', waitstdout: false }, function(err, portresp) {
        if(err) {
            callback(err, false);
        } else {
            //console.log(portht);
            callback(false, portresp);
        }
    });
}