const powershell = require('../../../lib/powershell');

module.exports = function(params, callback) {
    let requiredparams = ['Name', 'Driver', 'Port']
    for(let i = 0; i <= requiredparams.length - 1; i++) {
        if(params.hasOwnProperty(requiredparams[i])==false) {
            callback('Request must contain a ' + requiredparams[i] + ' property');
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
        powershell.runCommand({ cmd: 'Add-Printer -Name "' + name + '" -DriverName "' + params.Driver + '" -PortName "' + params.Port + '" -Location "' + location + '" -Comment "' + comment + '"' }, function(err, printerresp) {
            if(err) {
                callback(err, false);
            } else {
                callback(false, printerresp);
            }
        });
    }
}