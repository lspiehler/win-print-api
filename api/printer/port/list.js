const port = require('../../../lib/port');

module.exports = function(params, callback) {
    port.list(params, function(err, response) {
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
                    data: response
                }
            }
            callback(false, resp);
        }
    });
}