const powershell = require('../../../lib/powershell');

module.exports = function(params, callback) {
    let requiredparams = ['Name', 'Driver', 'Port']
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
    if(params.hasOwnProperty('Location')) {
        location = params.Location;
    }
    if(params.hasOwnProperty('Comment')) {
        comment = params.Comment;
    }
    let multipletrays = false;
    let trays = 0;
    if(params.hasOwnProperty('Trays') && params.Trays >= 1) {
        trays = params.Trays - 1;
        multipletrays = true;
    }
    for(let i = 0; i <= trays; i++) {
        let name;
        if(multipletrays) {
            name = params.Name + '-T' + (i + 1);
        } else {
            name = params.Name;
        }
        powershell.runCommand({ cmd: 'Add-Printer -Name "' + name + '" -DriverName "' + params.Driver + '" -PortName "' + params.Port + '" -Location "' + location + '" -Comment "' + comment + '"', waitstdout: false }, function(err, printerresp) {
            console.log('done');
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
    }
}