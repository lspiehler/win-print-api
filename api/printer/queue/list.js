const powershell = require('../../../lib/powershell');

var printerht;

module.exports = function(params, callback) {
    if(printerht) {
        callback(false, printerht);
    } else {
        powershell.runCommand({ cmd: 'Get-Printer | ConvertTo-Json' }, function(err, printerresp) {
            if(err) {
                callback(err, false);
            } else {
                let printers = JSON.parse(printerresp.stdout.toString());
                printerht = {};
                for(let i = 0; i <= printers.length - 1; i++) {
                    /*if(printerht.hasOwnProperty(printers[i].Name)) {

                    }*/
                    delete printers[i].CimSystemProperties;
                    delete printers[i].CimInstanceProperties;
                    delete printers[i].CimClass;
                    printerht[printers[i].Name] = printers[i];
                }
                //console.log(printerht);
                callback(false, printerht);
            }
        });
    }
}