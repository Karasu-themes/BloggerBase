import * as sass from 'sass';
import path from 'node:path';
import postcss from 'postcss';

export async function compileStyles(content, lang = "css", scss_style = "compressed", plugins) {
  // scss
  if (lang === "scss") {
    const sassFile = await sass.compileStringAsync(content, {
      loadPaths: [
        path.resolve('./app/assets/'),
        path.resolve('./app/assets/css/'),
        path.resolve('./app/assets/scss/')
      ],
      style: scss_style
    });

    return sassFile.css;

    // postcss
  } else if (lang === "pcss") {
    const pcss = await postcss(plugins).process(content, { from: undefined });

    return pcss.css;

    // CSS
  } else {

    return content;
  }
}