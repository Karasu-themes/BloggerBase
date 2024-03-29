import fs from 'node:fs';
import path from 'node:path';
import * as sass from 'sass';
import postcss from 'postcss';

async function compileStyles(content, lang = "css", scss_style = "compressed", plugins) {
  // scss
  if (lang === "scss" || lang === "sass") {
    const sassFile = await sass.compileStringAsync(content, {
      loadPaths: [
        path.resolve('./app/assets/'),
        path.resolve('./app/assets/css/'),
        path.resolve('./app/assets/scss/'),
        path.resolve('./app/assets/sass/')
      ],
      style: scss_style
    });

    const compiledScss = await postcss(plugins).process(sassFile.css, { from: undefined });

    return compiledScss.css;

    // postcss
  } else if (lang === "pcss" || lang === "css") {
    const pcss = await postcss(plugins).process(content, { from: undefined });

    return pcss.css;

    // CSS
  } else {
    return content;
  }
}

function loadFileSync ( pathFile ) {
  if (fs.existsSync(pathFile)) return fs.readFileSync( pathFile, 'utf8' );
  return "";
}

export default async function compileCss( srcFile, {lang, style, plugins}) {
  const pathFile = path.join(path.resolve('./app/assets/'), srcFile);
  const fileData = loadFileSync(pathFile);
  const compiled = await compileStyles(fileData, lang, style, plugins);

  return compiled
}