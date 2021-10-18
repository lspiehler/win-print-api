const queue = require('../../../lib/queue');

module.exports = function(params, callback) {
    queue.flush(params, function(err, response) {
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
                    message: 'Print jobs deleted successfully',
                    data: params
                }
            }
            callback(false, resp);
        }
    });
}