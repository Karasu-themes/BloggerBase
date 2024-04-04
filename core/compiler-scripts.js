import fs from 'node:fs';
import path from 'node:path';
import { rollup } from 'rollup';
import { minify } from "terser";
import { CONFIG } from './config.js';
import { btagParams, getRollupConfig } from "./utils.js";

export default async function compilerScripts(content, opts = {}) {
  let scripts = content;
  const bscripts = content.match(/@script((.*)?)\;?/g) ?? [];
  const rollupConfig = await getRollupConfig(CONFIG.route);

  for (const bscript of bscripts) {
    const params = btagParams(bscript);

    // Compile scripts only if src is provided
    if (params.src) {
      const params = btagParams(bscript);
      const filePath = path.resolve(path.join(CONFIG.route, CONFIG.folderName, CONFIG.folderAssets, params.src))
      const fileName = path.basename(filePath).replace('.js', '');

      const bundle = await rollup({
        input: filePath,
        plugins: [...rollupConfig.plugins]
      });

      // Generate de compile code
      const { output } = await bundle.generate({
        format: params.format || "iife",
        name: params.name ?? fileName
      });
      const [{ code }] = output;

      // Minify the code
      const minifyCode = await minify(code);

      // Write the compiled css for production
      if (opts.modes.mode === "production") {
        const pathBuild = `./${CONFIG.folderDist}/js`;
        if (!fs.existsSync(`./${CONFIG.folderDist}`)) fs.mkdirSync(`./${CONFIG.folderDist}`);
        if (!fs.existsSync(pathBuild)) fs.mkdirSync(pathBuild);
        fs.writeFileSync(path.resolve(path.join(pathBuild, `${fileName}.js`)), code.trim(), "utf8")
        fs.writeFileSync(path.resolve(path.join(pathBuild, `${fileName}.min.js`)), minifyCode.code.trim(), "utf8");
      }

      scripts = scripts.replace(bscripts, minifyCode.code.trim());
    }
  }

  return scripts;
}