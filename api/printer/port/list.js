const powershell = require('../../../lib/powershell');

var portht;

module.exports = function(params, callback) {
    if(portht) {
        callback(false, portht);
    } else {
        powershell.runCommand({ cmd: 'Get-PrinterPort | ConvertTo-Json' }, function(err, portresp) {
            if(err) {
                callback(err, false);
            } else {
                let ports = JSON.parse(portresp.stdout.toString());
                portht = {};
                for(let i = 0; i <= ports.length - 1; i++) {
                    /*if(portht.hasOwnProperty(ports[i].Name)) {

                    }*/
                    delete ports[i].CimSystemProperties;
                    delete ports[i].CimInstanceProperties;
                    delete ports[i].CimClass;
                    portht[ports[i].Name] = ports[i];
                }
                //console.log(portht);
                callback(false, portht);
            }
        });
    }
}