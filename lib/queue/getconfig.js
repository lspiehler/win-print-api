const setprinter = require('../setprinter');

module.exports = function(params, callback) {
    if(!params.type) {
        params.type = '8';
    }
    setprinter.runCommand({ cmd: ['-show', params.name, params.type], waitstdout: true }, function(err, output) {
        //console.log(output);
        if(err) {
            callback(err, false);
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
            callback(false, props);
        }
    });
}