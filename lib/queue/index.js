//const qlist = require('./list');
//const qcreate = require('./create');
//const qdelete = require('./delete');
const qsetconfig = require('./setconfig');
const qgetconfig = require('./getconfig');

module.exports = {
    //list: qlist,
    //create: qcreate,
    //delete: qdelete,
    setconfig: qsetconfig,
    getconfig: qgetconfig
}