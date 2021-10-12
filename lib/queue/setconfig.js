const setprinter = require('../setprinter');

module.exports = function(params, callback) {
    //console.log(params);
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
            callback(err, false);
        } else {
            callback(false, output.stdout.toString().trim());
        }
    });
}