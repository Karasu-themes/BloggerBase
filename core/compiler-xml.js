import ejs from 'ejs';
import fs from 'node:fs';
import path from 'node:path';
import { CONFIG } from './config.js';
import { getEntryPointApp, getEjsVariables, getThemeConfig } from './utils.js';

export default async function compilerXML(opts) {
  const entryPoint = getEntryPointApp(CONFIG.route, CONFIG.folderName);
  const entryPointPath = path.resolve(path.join(CONFIG.route, CONFIG.folderName, entryPoint));
  const content = fs.readFileSync(entryPointPath, 'utf8');
  const njkOpts = await getEjsVariables(CONFIG.route);
  const themeOpts = await getThemeConfig(CONFIG.route);
  
  // Compiler ejs files
  const ejsContent = ejs.render(content, {
    ...njkOpts,
    ...opts,
    ...themeOpts
  }, { filename: entryPointPath });

  return ejsContent;
}