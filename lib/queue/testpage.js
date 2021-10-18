const powershell = require('../powershell');

module.exports = function(params, callback) {
    let cmd = 'Get-CimInstance Win32_Printer -Filter "Name = \'' + params.name + '\'" | Invoke-CimMethod -MethodName printtestpage';
    //console.log('powershell ' + cmd);
    powershell.runCommand({ cmd: cmd, waitstdout: true }, function(err, resp) {
        if(err) {
            callback(err, false);
        } else {
            //console.log(resp);
            callback(false, resp);
        }
    });
}