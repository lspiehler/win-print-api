const { spawn } = require( 'child_process' );

var normalizeCommand = function(command) {
    let cmd = command.split(' ');
    let outcmd = [];
    let cmdbuffer = [];
    for(let i = 0; i <= cmd.length - 1; i++) {
        if(cmd[i].charAt(cmd[i].length - 1) == '\\') {
            cmdbuffer.push(cmd[i]);
        } else {
            if(cmdbuffer.length > 0) {
                outcmd.push(cmdbuffer.join(' ') + ' ' + cmd[i]);
                cmdbuffer.length = 0;
            } else {
                outcmd.push(cmd[i]);
            }
        }
    }
    return outcmd;
}

var powershellCommand = function(params, callback) {
    const stdoutbuff = [];
    const stderrbuff = [];
    var code;
    var exited = false;
    var stdoutrecvd = false;
    var stderrrecvd = true;

    var handleExit = function() {
        var out = {
            command: 'powershell ' + params.cmd,
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
        const powershell = spawn( 'powershell', normalizeCommand(params.cmd), {cwd: params.cwd } );

        if(params.hasOwnProperty('stdin')) {
            if(params.stdin) {
                powershell.stdin.write(params.stdin);
                powershell.stdin.end();
            }
        }

        powershell.stdout.on('data', function(data) {
            stdoutrecvd = true;
            stdoutbuff.push(data);
            if(exited && code == 0) {
                handleExit();
            }
        });

        powershell.on('error', function(err) {
            console.log(err);
            callback(err, false);
            return;
        });
        
        powershell.stderr.on('data', function(data) {
            stderrrecvd = true;
            stderrbuff.push(data);
            if(exited && code != 0) {
                handleExit();
            }
        });

        powershell.on('exit', function(ecode) {
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
        powershellCommand(params, function(err, out) {
            if(err) {
                callback(err, out);
            } else {
                callback(false, out);
            }
        });
    }
}