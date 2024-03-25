import path from 'node:path';
import chalk from 'chalk';
import {
  getPostcssConfig,
  tagStyle,
  btagSelector,
  btagParams
} from './utils.js';
import compileCss from './style-compile.js';

export default async function styles(content) {
  let html = content;
  const postcssConfig = await getPostcssConfig(process.env.PWD);
  const bstyles = btagSelector(content, 'b:style');

  for (const bstyle of bstyles) {
    const params = btagParams(bstyle);
    let compiled = '';

    const lang = path.extname(params.src).replace('.', '');

    // Avisamos que una etiqueta b:style no tiene el atributo src para funcionar
    if (!params.src) { console.log(`${chalk.yellowBright(`[warning]: An ${chalk.bold("<b:style>")} tag does not have the src (required) attribute`)}`); }

    if (params.src) {
      compiled = await compileCss(params.src, {
        cdta: params.cdta,
        lang: lang ?? "css",
        style: params.output || "compressed",
        plugins: postcssConfig.plugins
      });
    }

    if (params.render && params.src) {
      html = html.replace(bstyle, `${tagStyle(params.cdta, compiled.trim())}`);
    } else {
      html = html.replace(bstyle, compiled.trim());
    }
  }

  return html;
}