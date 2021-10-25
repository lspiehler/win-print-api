const powershell = require('../powershell');

module.exports = function(params, callback) {
    //let cmd = 'Get-CimInstance Win32_Printer -Filter "Name = \'' + params.name + '\'" | Invoke-CimMethod -MethodName printtestpage';
    let cmd = 'rundll32 printui.dll PrintUIEntry /k /n "' + params.name + '"';
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