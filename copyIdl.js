// copyIdl.js
const fs = require('fs');
const idl = require('../target/idl/flip.json');

fs.writeFileSync('./idl.json', JSON.stringify(idl));
