const powershell = require('../../../lib/powershell');

module.exports = function(params, callback) {
    powershell.runCommand({ cmd: 'Remove-Printer -Name "' + params.name + '"', waitstdout: false }, function(err, portresp) {
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
                status: 200,
                headers: [],
                body: {
                    result: 'success',
                    message: 'Printer deleted successfully',
                    data: null
                }
            }
            callback(false, resp);
        }
    });
}