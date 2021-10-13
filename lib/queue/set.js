const powershell = require('../powershell');

module.exports = function(params, callback) {
    //console.log(params);
    let properties = [];
    let keys = Object.keys(params.properties)
    for(let i = 0; i <= keys.length - 1; i++) {
        properties.push('-' + keys[i] + ' "' + params.properties[keys[i]] + '"');
    }
    //console.log(properties.join(' '));
    //callback(false, false);
    let cmd = 'Set-Printer -Name "' + params.name + '" ' + properties.join(' ');
    //console.log('powershell ' + cmd);
    powershell.runCommand({ cmd: cmd, waitstdout: false }, function(err, resp) {
        if(err) {
            callback(err, false);
        } else {
            callback(false, resp);
        }
    });
}