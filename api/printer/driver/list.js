const powershell = require('../../../lib/powershell');

var driverht;

module.exports = function(params, callback) {
    if(driverht) {
        callback(false, driverht);
    } else {
        powershell.runCommand({ cmd: 'Get-PrinterDriver | ConvertTo-Json' }, function(err, driverresp) {
            if(err) {
                callback(err, false);
            } else {
                let drivers = JSON.parse(driverresp.stdout.toString());
                driverht = {};
                for(let i = 0; i <= drivers.length - 1; i++) {
                    /*if(driverht.hasOwnProperty(drivers[i].name)) {

                    }*/
                    delete drivers[i].CimSystemProperties;
                    delete drivers[i].CimInstanceProperties;
                    delete drivers[i].CimClass;
                    driverht[drivers[i].name] = drivers[i];
                }
                //console.log(driverht);
                callback(false, driverht);
            }
        });
    }
}