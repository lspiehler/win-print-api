const powershell = require('../powershell');

module.exports = function(params, callback) {
    let cmd = 'Get-PrintJob -PrinterName "' + params.name + '" | Remove-PrintJob';
    //console.log('powershell ' + cmd);
    powershell.runCommand({ cmd: cmd, waitstdout: false }, function(err, resp) {
        if(err) {
            callback(err, false);
        } else {
            //console.log(resp);
            callback(false, resp);
        }
    });
}