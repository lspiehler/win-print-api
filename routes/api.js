var express = require('express');
var router = express.Router();
const printer = require('../api/printer');

/* GET users listing. */
router.get('/printer/:object/:action', function(req, res, next) {
    if(printer.hasOwnProperty(req.params.object) && printer[req.params.object].hasOwnProperty(req.params.action)) {
        printer[req.params.object][req.params.action]({}, function(err, queues) {
            if(err) {
                res.status(500).send(err);
            } else {
                res.json(queues);
            }
        });
    } else {
        res.status(404).send('No route found for ' + req.url);
    }
});

router.post('/printer/:object/:action', function(req, res, next) {
    if(printer.hasOwnProperty(req.params.object) && printer[req.params.object].hasOwnProperty(req.params.action)) {
        console.log(req.body);
        printer[req.params.object][req.params.action](req.body, function(err, queues) {
            if(err) {
                res.status(500).send(err);
            } else {
                res.json(queues);
            }
        });
    } else {
        res.status(404).send('No route found for ' + req.url);
    }
});

module.exports = router;
