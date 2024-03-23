import { rollup } from 'rollup';
import path from 'node:path';
import { getRollupConfig, btagSelector, btagParams } from './utils.js';

const ROOT_ASSET = path.resolve('./app/assets/');

export default async function scripts(content) {
  let html=content;
  const rollupConfig = await getRollupConfig(process.env.PWD);
  const bscripts = btagSelector(content, 'b:script');

  for (const bscript of bscripts) {
    const params = btagParams(bscript);
    const pathFile = params.src ?? false;
    const bundle = await rollup({
      input: path.resolve(ROOT_ASSET + "/" + pathFile),
      plugins: [...rollupConfig.plugins]
    });

    const { output } = await bundle.generate({ 
      format: params.format || "iife", 
      name: params.name ?? path.basename(pathFile).replace('.js', '') 
    });
    const [{ code }] = output;

    html=html.replace(bscript, `<script>\n${params.cdta ? `//<![CDATA[\n${code.trim()}\n//]]>` : code.trim()}</script>`)
  }

  return html;
}