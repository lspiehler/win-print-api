const setprinter = require('../../../lib/setprinter');

module.exports = function(params, callback) {
    if(!params.type) {
        params.type = '8';
    }
    let keys = Object.keys(params.options);
    let options = [];
    for(let i = 0; i <= keys.length - 1; i++) {
        options.push(keys[i] + '=' + params.options[keys[i]])
    }
    setprinter.runCommand({ cmd: [params.name, params.type, 'pDevMode=' + options.join(',')], waitstdout: true }, function(err, output) {
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
                    message: null,
                    data: output.stdout.toString().trim()
                }
            }
            callback(false, resp);
        }
    });
}