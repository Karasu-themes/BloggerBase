import * as cheerio from 'cheerio';
import { rollup } from 'rollup';
import path from 'node:path';
import { getRollupConfig } from './utils.js';

const ROOT_ASSET = path.resolve('./app/assets/');

export default async function scripts(content) {

  const $ = cheerio.load(content, { xmlMode: true, decodeEntities: false });
  const rollupConfig = await getRollupConfig(process.env.PWD);

  for (const script of $('b\\:script')) {
    const attributes = script.attribs;
    const pathFile = attributes.src ?? false;

    if (pathFile) {

      const format = attributes.format ?? "iife";
      const cdta = attributes.cdta == '' ? true : false;
      const name = attributes.name ?? path.basename(pathFile).replace('.js', '');

      const bundle = await rollup({
        input: path.resolve(ROOT_ASSET + "/" + pathFile),
        plugins: [...rollupConfig.plugins]
      });

      const { output } = await bundle.generate({ format, name });
      const [{ code }] = output;

      $(script).replaceWith(`<script>\n${cdta ? `//<![CDATA[\n${code.trim()}\n//]]>` : code.trim()}</script>`);
    }

  }

  const result = $.html();

  return result;
}