const powershell = require('../../../lib/powershell');
const queue = require('../../../lib/queue');

var configPrinter = function(params, results, index, callback) {
    if(!index) {
        index = 0;
    }
    if(index <= params.config.length - 1) {
        params.config[index].name = params.name;
        queue.setconfig(params.config[index], function(err, result) {
            results.push(result);
            configPrinter(params, results, index + 1, callback);
        });
    } else {
        callback(false, results);
    }
}

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
    let shared = '-Shared:$False';
    if(params.shared) {
        let sharename = params.name;
        if(params.sharename) {
            sharename = params.sharename;
        }
        shared = '-Shared:$True -ShareName "' + sharename + '"';
    }
    /*for(let i = 0; i <= trays; i++) {
        let name;
        if(multipletrays) {
            name = params.name + '-T' + (i + 1);
        } else {
            name = params.name;
        }*/
        let cmd = 'Add-Printer -Name "' + params.name + '" -DriverName "' + params.driver + '" -PortName "' + params.port + '" -Location "' + location + '" -Comment "' + comment + '" ' + shared;
        //console.log(cmd);
        powershell.runCommand({ cmd: cmd, waitstdout: false }, function(err, printerresp) {
            //console.log(cmd);
            if(err) {
                if(err.toUpperCase().indexOf('THE SPECIFIED PRINTER ALREADY EXISTS') >= 0) {
                    let resp = {
                        status: 200,
                        headers: [],
                        body: {
                            result: 'error',
                            message: 'The printer already exists',
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
                if(params.config) {
                    configPrinter(params, [], 0, function(err, result) {
                        //console.log(result);
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
                    });
                } else {
                    //console.log('not for this printer');
                    //console.log(params);
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
            }
        });
    //}
}