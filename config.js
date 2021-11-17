require('dotenv').config({ path: require('path').join(__dirname, '.env')});
const os = require("os");
//var EventLogger = require('node-windows').EventLogger;
//const util = require('util');

//var log = new EventLogger('win-print-api');

//log.info(__dirname);
//log.info('this is a test');

function getBoolean(str) {
	if(str) {
		if(str.toUpperCase()=='TRUE') {
			return true;
		} else if(str.toUpperCase()=='FALSE') {
			return false;
		} else {
			return str;
		}
	} else {
		return false;
	}
}

module.exports = {
    MANAGEMENTURL: process.env.MANAGEMENTURL || 'http://192.168.1.200:80',
    LISTENPORT: parseInt(process.env.LISTENPORT) || 3000,
    HOSTNAME: process.env.HOSTNAME || os.hostname(),
    DOMAIN: process.env.DOMAIN || null,
    USEWMI: getBoolean(process.env.USEWMI) || false,
    USEFILES: getBoolean(process.env.USEFILES) || false
}