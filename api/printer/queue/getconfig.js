const setprinter = require('../../../lib/setprinter');

module.exports = function(params, callback) {
    if(!params.type) {
        params.type = '8';
    }
    setprinter.runCommand({ cmd: ['-show', params.name, params.type], waitstdout: true }, function(err, output) {
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
            let props = {};
            let lines = output.stdout.toString().split('\r\n');
            for(let i = 2; i <= lines.length - 3; i++) {
                let prop = lines[i].split('=');
                let value = prop[1].trim();
                if(value[0]=="\"") {
                    props[prop[0].trim()] = value.split("\"")[1];
                } else {
                    props[prop[0].trim()] = value;
                }
            }
            let resp = {
                status: 200,
                headers: [],
                body: {
                    result: 'success',
                    message: null,
                    data: props
                }
            }
            callback(false, resp);
        }
    });
}