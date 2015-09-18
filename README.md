parsini
=======

This is a toy INI format parser for Node.js. Support might not be provided. Use it at your own risk.

# Installation

```bash
npm install --save parsini
```

# Usage

```js
var fs = require('fs');
var parsini = require('parsini');

var iniData = parsini(fs.readFileSync('path/to/file.ini').toString());
console.log(iniData);
```

