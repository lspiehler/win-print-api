//const qlist = require('./list');
//const qcreate = require('./create');
//const qdelete = require('./delete');
const qsetconfig = require('./setconfig');
const qgetconfig = require('./getconfig');
const qset = require('./set');
const qflush = require('./flush');
const qtestpage = require('./testpage');

module.exports = {
    //list: qlist,
    //create: qcreate,
    //delete: qdelete,
    setconfig: qsetconfig,
    getconfig: qgetconfig,
    set: qset,
    flush: qflush,
    testpage: qtestpage
}