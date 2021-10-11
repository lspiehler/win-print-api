const { spawn } = require( 'child_process' );

var setprinterCommand = function(params, callback) {
    const stdoutbuff = [];
    const stderrbuff = [];
    var code;
    var exited = false;
    var stdoutrecvd = false;
    var stderrrecvd = true;

    var handleExit = function() {
        var out = {
            command: 'setprinter ' + params.cmd,
            stdout: Buffer.concat(stdoutbuff),
            stderr: Buffer.concat(stderrbuff),
            exitcode: code
        }
        if (code != 0) {
            callback(Buffer.concat(stderrbuff).toString(), out);
        } else {
            callback(false, out);
        }
    }

    try {
        const setprinter = spawn( 'setprinter', params.cmd, {cwd: params.cwd } );

        if(params.hasOwnProperty('stdin')) {
            if(params.stdin) {
                setprinter.stdin.write(params.stdin);
                setprinter.stdin.end();
            }
        }

        setprinter.stdout.on('data', function(data) {
            stdoutrecvd = true;
            stdoutbuff.push(data);
            if(exited && code == 0) {
                handleExit();
            }
        });

        setprinter.on('error', function(err) {
            console.log(err);
            callback(err, false);
            return;
        });
        
        setprinter.stderr.on('data', function(data) {
            stderrrecvd = true;
            stderrbuff.push(data);
            if(exited && code != 0) {
                handleExit();
            }
        });

        setprinter.on('exit', function(ecode) {
            exited = true;
            code = ecode;
            if(ecode == 0) {
                if(stdoutrecvd) {
                    handleExit();
                }
                if(params.hasOwnProperty('waitstdout')) {
                    if(params.waitstdout==false) {
                        handleExit();
                    }
                }
            }

            if(stderrrecvd && ecode != 0) {
                handleExit();
            }
            
        });

    } catch(e) {
        console.log(e);
        callback(e, false);
        return;
    }
}

module.exports = {
    runCommand: function(params, callback) {
        setprinterCommand(params, function(err, out) {
            if(err) {
                callback(err, out);
            } else {
                callback(false, out);
            }
        });
    }
}