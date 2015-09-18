var fs = require('fs');

var parsini = require('./parsini');

var str = fs.readFileSync('./test.ini').toString();
console.log(parsini(str));
