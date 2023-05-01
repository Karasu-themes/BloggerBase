const chokidar = require('chokidar');
const bloggerBase = require('../package.json');
const themeConfig = require('../theme.config');
const ejsConfig = require('../utils.ejs.js');
const ejs = require('ejs');
const { pathPage, writeFile, loadFile, resolve, renderAssets, timeStamp } = require('./base.core');

// Rollup plugins
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');

const watcher = chokidar.watch([
  './pages/**/*.ejs',
  './assets/**/*.{scss,sass,css}'
], {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

const build = async () => {

  console.log( `${timeStamp(new Date)} Compiling ejs...`)
  
  const path = resolve( pathPage + "/main.ejs" );
  const content = loadFile( path );

  const ejsContent = ejs.render(content, {
    ...ejsConfig, 
    ...themeConfig,
    ...{ name: bloggerBase.name, version: bloggerBase.version}
  }, {
    filename: path,
  });

  const assets = await renderAssets( 
    ejsContent, 
    // postcss plugins
    [
      require('autoprefixer'), require('cssnano') 
    ],
    // rollup plugins
    [
      nodeResolve(),
      babel({ babelHelpers: 'bundled' }),
      terser()
    ]
  );

  writeFile("./bundle/main.xml", assets );
}

let timeout;
watcher.on('change', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    build().then(() => console.log( `${timeStamp(new Date)} Compiled`));
  }, 500);
});

watcher.on('add', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    build().then(() => console.log( `${timeStamp(new Date)} Compiled`));
  }, 500);
});

watcher.on('unlink', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    build().then(() => console.log( `${timeStamp(new Date)} Compiled`));
  }, 500);
});

watcher.on('addDir', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    build().then(() => console.log( `${timeStamp(new Date)} Compiled`));
  }, 500);
});

watcher.on('unlinkDir', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    build().then(() => console.log( `${timeStamp(new Date)} Compiled`));
  }, 500);
});