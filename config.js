require('dotenv').config();
const os = require("os");

module.exports = {
    MANAGEMENTURL: process.env.MANAGEMENTURL || 'http://192.168.1.200:80',
    LISTENPORT: parseInt(process.env.LISTENPORT) || 3000,
    HOSTNAME: process.env.HOSTNAME || os.hostname(),
    DOMAIN: process.env.DOMAIN || null
}