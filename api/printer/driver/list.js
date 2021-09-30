const powershell = require('../../../lib/powershell');

var driverht;

module.exports = function(params, callback) {
    if(driverht) {
        let resp = {
            status: 200,
            headers: [],
            body: {
                result: 'success',
                message: null,
                data: driverht
            }
        }
        callback(false, resp);
    } else {
        powershell.runCommand({ cmd: 'Get-PrinterDriver | ConvertTo-Json' }, function(err, driverresp) {
            if(err) {
                let resp = {
                    status: 500,
                    headers: [],
                    body: {
                        result: 'error',
                        message: err,
                        data: null
                    }
                }
                callback(false, resp);
            } else {
                //console.log(driverresp.stdout.toString());
                let drivers = JSON.parse(driverresp.stdout.toString());
                let alldrivers = {};
                for(let i = 0; i <= drivers.length - 1; i++) {
                    /*if(driverht.hasOwnProperty(drivers[i].name)) {

                    }*/
                    delete drivers[i].CimSystemProperties;
                    delete drivers[i].CimInstanceProperties;
                    delete drivers[i].CimClass;
                    alldrivers[drivers[i].Name] = drivers[i];
                }
                driverht = alldrivers;
                let resp = {
                    status: 200,
                    headers: [],
                    body: {
                        result: 'success',
                        message: null,
                        data: alldrivers
                    }
                }
                callback(false, resp);
            }
        });
    }
}