const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const JSX_PATH = path.join(__dirname, 'public', 'react-app', 'App.jsx');
const JS_OUTPUT_PATH = path.join(__dirname, 'public', 'react-app', 'App.js');

function build() {
  console.log('⚡ Pre-compiling React JSX (runtime: classic for UMD React)...');
  const jsxCode = fs.readFileSync(JSX_PATH, 'utf-8');
  
  const result = babel.transformSync(jsxCode, {
    presets: [
      ['@babel/preset-react', { runtime: 'classic' }]
    ]
  });

  fs.writeFileSync(JS_OUTPUT_PATH, result.code, 'utf-8');
  console.log(`✅ Compilation successful! Saved compiled pure JS to: ${JS_OUTPUT_PATH} (${(result.code.length / 1024).toFixed(1)} KB)`);
}

build();
