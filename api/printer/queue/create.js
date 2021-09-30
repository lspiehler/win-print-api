const powershell = require('../../../lib/powershell');

module.exports = function(params, callback) {
    let requiredparams = ['name', 'driver', 'port']
    for(let i = 0; i <= requiredparams.length - 1; i++) {
        if(params.hasOwnProperty(requiredparams[i])==false) {
            let resp = {
                status: 500,
                headers: [],
                body: {
                    result: 'error',
                    message: 'Request must contain a ' + requiredparams[i] + ' property',
                    data: null
                }
            }
            callback(false, resp);
            return;
        }
    }
    let location = '';
    let comment = '';
    if(params.hasOwnProperty('location')) {
        location = params.location;
    }
    if(params.hasOwnProperty('comment')) {
        comment = params.comment;
    }
    let multipletrays = false;
    let trays = 0;
    if(params.hasOwnProperty('Trays') && params.Trays >= 1) {
        trays = params.Trays - 1;
        multipletrays = true;
    }
    /*for(let i = 0; i <= trays; i++) {
        let name;
        if(multipletrays) {
            name = params.name + '-T' + (i + 1);
        } else {
            name = params.name;
        }*/
        powershell.runCommand({ cmd: 'Add-Printer -Name "' + params.name + '" -DriverName "' + params.driver + '" -PortName "' + params.port + '" -Location "' + location + '" -Comment "' + comment + '"', waitstdout: false }, function(err, printerresp) {
            console.log('Add-Printer -Name "' + params.name + '" -DriverName "' + params.driver + '" -PortName "' + params.port + '" -Location "' + location + '" -Comment "' + comment + '"');
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
                let resp = {
                    status: 201,
                    headers: [],
                    body: {
                        result: 'success',
                        message: 'The print queue was created successfully',
                        data: params
                    }
                }
                callback(false, resp);
            }
        });
    //}
}