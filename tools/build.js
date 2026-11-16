// Builds site/bubliots/game.min.js from src/game.js
//   npm install        (once, installs terser)
//   npm run build
// - removes the developer test hook (DEV-START .. DEV-END)
// - replaces the readable list of allowed domains with hashes
// - minifies and mangles the code
'use strict';
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const root = path.join(__dirname, '..');
let src = fs.readFileSync(path.join(root, 'src', 'game.js'), 'utf8');

src = src.replace(/\/\*DEV-START\*\/[\s\S]*?\/\*DEV-END\*\//, '');

function hsh(str) { let h = 5381; for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return h; }
src = src.replace(/\/\*LOCK-START\*\/([\s\S]*?)\.map\(hsh\)\/\*LOCK-END\*\//, (m, list) => {
  const domains = Function('return ' + list)();
  console.log('allowed domains:', domains.join(', '));
  return JSON.stringify(domains.map(hsh));
});

const banner = '/*! BUBLIOTS - Copyright (c) directly2you ltd. All rights reserved. Copying or redistribution without written permission is prohibited. */';

minify(src, { compress: { passes: 2 }, mangle: { toplevel: true }, format: { comments: false, preamble: banner } }).then(out => {
  const file = path.join(root, 'site', 'bubliots', 'game.min.js');
  fs.writeFileSync(file, out.code + '\n');
  console.log('written', path.relative(root, file), out.code.length, 'bytes (source', src.length, 'bytes)');
}).catch(err => { console.error(err); process.exit(1); });
