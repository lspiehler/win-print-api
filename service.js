var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name:'Print Management Service',
    description: 'Print Management Service',
    script: 'C:\\win-print-api\\bin\\www',
    env: [
        {
          name: 'APP_DIR_PATH',
          value: 'C:\\win-print-api'
        }
      ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
    svc.start();
});

svc.install();