import * as cheerio from 'cheerio';
import { getPostcssConfig, tagStyle } from './utils.js';
import { cssBuild } from './style-directive.js';
import { themeConfig } from '../theme.config.js';
import { extname } from 'node:path';

export default async function styles(content) {

  const $ = cheerio.load(content, { xmlMode: true, decodeEntities: false });
  const postcssConfig = await getPostcssConfig(process.env.PWD);

  for (const style of $('b\\:style')) {
    const attribute = style.attribs;
    const src = attribute.src ?? false;
    const cdta = attribute.cdta ? true : false;
    const scss_style = attribute.output ?? "compressed";
    const render = attribute.render ? true : false;
    let compiled='';
    
    if (src) {
      const lang = extname(src).replace('.', '');
      compiled = await cssBuild(src, {
        cdta,
        lang: lang ?? "css",
        style: scss_style,
        plugins: postcssConfig.plugins
      });
    }

    if (render && src) {
      $(style).replaceWith(`${tagStyle(cdta, compiled.trim())}`);
    } else $(style).replaceWith(`${compiled.trim()}`);
  }

  for (const bskin of $('b\\:skin')) {
    $(bskin).replaceWith(`<b:skin version='${themeConfig.theme.version}'><![CDATA[${$(bskin).html()}]]></b:skin>`.trim());
  }
  
  for (const bskin of $('b\\:template-skin')) {
    $(bskin).replaceWith(`<b:template-skin><![CDATA[${$(bskin).html()}]]></b:template-skin>`.trim());
  }

  const results = $.html();

  return results;
}