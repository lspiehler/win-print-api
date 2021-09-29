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
            if(err.toUpperCase().indexOf('THE SPECIFIED PORT ALREADY EXISTS')) {
                let resp = {
                    status: 200,
                    headers: [],
                    body: {
                        result: 'success',
                        message: 'The port already exists',
                        data: null
                    }
                }
                callback(err, resp);
            } else {
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
            }
        } else {
            let resp = {
                status: 201,
                headers: [],
                body: {
                    result: 'success',
                    message: 'The port was created successfully',
                    data: null
                }
            }
            callback(false, resp);
        }
    });
}