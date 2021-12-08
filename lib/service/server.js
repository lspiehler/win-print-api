var https = require('https');
var fs = require('fs');
var debug = require('debug')('win-print-api:server');
const serverlib = require('../../lib/server');

var server;

const opts = {
  key: fs.readFileSync(require('path').join(__dirname, '../../cert/cert.key')),
  cert: fs.readFileSync(require('path').join(__dirname, '../../cert/cert.pem')),
  ca: fs.readFileSync(require('path').join(__dirname, '../../cert/ca.pem')),
  requestCert: true,
  rejectUnauthorized: true
}

function pingManagement() {
    serverlib.ping(function(err, resp) {
      if(err) {
        console.log('Error connecting to management server');
        console.log(err);
      } else {
        //console.log(resp);
      }
      setTimeout(function() {
        pingManagement();
      }, 5000);
    });
  }

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
    pingManagement();
  }

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  
function replaceCert(params, callback) {
    //console.log(params);
    fs.writeFile(require('path').join(__dirname, '../../cert/cert.key.old'), opts.key, 'utf8', function(err) {
      if(err) {
        console.log(err);
        callback(err, false);
      } else {
        fs.writeFile(require('path').join(__dirname, '../../cert/cert.pem.old'), opts.cert, 'utf8', function(err) {
          if(err) {
            console.log(err);
            callback(err, false);
          } else {
            fs.writeFile(require('path').join(__dirname, '../../cert/cert.key'), params.key, 'utf8', function(err) {
              if(err) {
                console.log(err);
                callback(err, false);
              } else {
                fs.writeFile(require('path').join(__dirname, '../../cert/cert.pem'), params.cert, 'utf8', function(err) {
                  if(err) {
                    console.log(err);
                    callback(err, false);
                  } else {
                    server.setSecureContext({
                      cert: params.cert,//fullchain
                      key: params.key,
                      ca: opts.ca,
                      requestCert: opts.requestCert,
                      rejectUnauthorized: opts.rejectUnauthorized
                    });
                    callback(false, 'certificates replaced')
                  }
                });
              }
            });
          }
        });
      }
    })
  }
 
module.exports = {
    start: function(params, callback) {
        server = https.createServer(opts, params.app);

        server.listen(params.port, function(err) {
            callback(false, server);
        });
        server.on('error', onError);
        server.on('listening', onListening);
    },
    replaceCert: function(params, callback) {
        replaceCert(params, function(err, result) {
            if(err) {
                callback(err, result);
            } else {
                callback(false, result);
            }
        });
    }
}