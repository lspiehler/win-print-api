const powershell = require('../../../lib/powershell');
const queue = require('../../../lib/queue');

let propertymap = {
    driver: 'drivername',
    port: 'portname'
}

let datatypes = {
    "comment": "string",
    "datatype": "string",
    "drivername": "string",
    "untiltime": "string",
    "keepprintedjobs": "bool",
    "location": "string",
    "separatorpagefile": "string",
    "shared": "bool",
    "sharename": "string",
    "starttime": "string",
    "name": "string",
    "permissionsddl": "string",
    "portname": "string",
    "printprocessor": "string",
    "priority": "string",
    "published": "bool",
    "renderingmode": "string",
    "disablebranchofficelogging": "bool",
    "branchofficeofflinelogsizemb": "string",
    "deviceurl": "string",
    "deviceuuid": "string",
    "throttlelimit": "string"
}

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

var generateArgs = function(params) {
    let args = [];
    let props = Object.keys(params);
    for(let i = 0; i <= props.length - 1; i++) {
        let translateproperty = props[i];
        //console.log('Examining property ' + props[i]);
        if(propertymap.hasOwnProperty(props[i])) {
            //console.log('property was translated from ' + props[i] + ' to ' + propertymap[props[i]]);
            translateproperty = propertymap[props[i]]
        }
        if(datatypes.hasOwnProperty(translateproperty)) {
            //console.log('Property definition exists ' + translateproperty);
            if(datatypes[translateproperty]=='string') {
                args.push('-' + translateproperty + ' "' + params[props[i]].split('"').join('`"') + '"');
            } else if(datatypes[translateproperty]=='bool') {
                if(params[props[i]]) {
                    args.push('-' + translateproperty + ':$True')
                } else {
                    args.push('-' + translateproperty + ':$False')
                }
            } else {

            }
        }
    }
    return args.join(' ');
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
        //let cmd = 'Add-Printer -Name "' + params.name + '" -DriverName "' + params.driver + '" -PortName "' + params.port + '" -Location "' + location + '" -Comment "' + comment + '" ' + shared;
        let cmd = 'Add-Printer ' + generateArgs(params);
        console.log(cmd);
        //console.log(generateArgs(params));
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