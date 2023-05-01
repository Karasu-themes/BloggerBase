const { readFileSync, writeFileSync } = require('fs');
const { resolve, extname, basename } = require('path');
const sass = require('sass');
const postcss = require('postcss');
const rollup = require('rollup');

const INCLUDE_PATH = resolve(resolve(''), 'pages');
const ASSETS_PATH = resolve(resolve(''), 'assets');


function fileLoader(pathFile) {
  return readFileSync(pathFile, "utf-8")
}

// Devuelve en formato de array de objetos los datos de la directiva assets
function getAssetsDirective(content) {
  const temp = [];
  const matches = content.match(/@assets\((.*)\)/g);

  if (matches == null ?? matches.length == 0) return [];

  matches.forEach(n => {
    const path = n.match(/path="([^"]+)"/g) != null ? n.match(/path="([^"]+)"/g)[0].match(/[^"]+/g)[1] : "";
    const output = n.match(/output="([^"]+)"/g) != null ? n.match(/output="([^"]+)"/g)[0].match(/[^"]+/g)[1] : "";
    const name = n.match(/name="([^"]+)"/g) != null ? n.match(/name="([^"]+)"/g)[0].match(/[^"]+/g)[1] : "";
    const cdta = /cdta/g.test(n);
    temp.push({
      match: n,
      path: path.trim(),
      output,
      name,
      cdta
    })
  })

  return temp
}

async function resolveAssets(content, postcssPlugins, rollupPlugins) {
  let compiledContent = content;

  const assets = getAssetsDirective(content);

  if (assets.length == 0) { return compiledContent; }

  await Promise.all(assets.map(async asset => {
    const pathFile = resolve(ASSETS_PATH + "/" + asset.path);

    // Procesamos los estilos scss/sass
    if (extname(asset.path) == ".scss") {
      const sassFile = await sass.compileAsync(pathFile);
      const postcssFile = await postcss(postcssPlugins).process(sassFile.css, { from: undefined });
      compiledContent = compiledContent.replace(asset.match, postcssFile);

      // Procesamos los estilos css
    } else if (extname(asset.path) == ".css") {
      const postcssFile = await postcss(postcssPlugins).process(fileLoader(pathFile), { from: undefined });

      compiledContent = compiledContent.replace(asset.match, postcssFile);

      // Procesamos los códigos js
    } else if (extname(asset.path) == ".js") {
      let bundleCode = '';
      const bundle = await rollup.rollup({
        input: pathFile,
        plugins: rollupPlugins
      });

      const { output } = await bundle.generate({ format: 'iife', name: asset.name || basename(pathFile).replace('.js', '') });
      const [{ code }] = output;

      if (asset.cdta) {
        bundleCode = `//<![CDATA[\n${code.trim()}\n//]]>`;
      } else { bundleCode = code.trim(); }

      compiledContent = compiledContent.replace(asset.match, bundleCode);

    } else {

      compiledContent = compiledContent;

    }

  }));

  return compiledContent;

}

module.exports = {
  pathPage: INCLUDE_PATH,
  pathAssets: ASSETS_PATH,
  resolve,
  // Compila los estilos que tengan la directiva @asset
  renderAssets: async function (fileContent, postcssPlugins = [], rollupPlugins) {
    const content = await resolveAssets(fileContent, postcssPlugins, rollupPlugins);
    return content;
  },
  loadFile: function (pathFile) {
    return readFileSync(pathFile, "utf-8")
  },
  writeFile: function (dest, content) {
    writeFileSync(dest, content, 'utf-8');
  },
  timeStamp: function ( currtime ) {
    const now = currtime;
    const time = now.toLocaleTimeString();
    return `[${time}]`;
  }
}