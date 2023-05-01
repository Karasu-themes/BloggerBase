const bloggerBase = require('../package.json');
const themeConfig = require('../theme.config');
const ejsConfig = require('../utils.ejs.js');
const ejs = require('ejs');
const { pathPage, writeFile, loadFile, resolve, renderAssets, timeStamp } = require('./base.core');

// Rollup plugins
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');


(async function build () {
  console.log(`${timeStamp(new Date())} Compiling ejs...`)
  
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

  console.log(`${timeStamp(new Date())} Compiled`);
})();
