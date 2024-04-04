import nunjucks from 'nunjucks';
import path from 'node:path';
import { CONFIG } from './config.js';
import { getEntryPointApp, getNjkVariables, getThemeConfig } from './utils.js';

export default async function compilerXML(opts) {
  const entryPoint = getEntryPointApp(CONFIG.route, CONFIG.folderName);
  const entryPointPath = path.resolve(path.join(CONFIG.route, CONFIG.folderName, entryPoint));
  const njkOpts = await getNjkVariables(CONFIG.route);
  const themeOpts = await getThemeConfig(CONFIG.route);

  // Set nunjucks configuration
  nunjucks.configure(path.resolve(path.join(CONFIG.route, CONFIG.folderName)));

  // Render nunjucks files
  const njkContent = nunjucks.render(entryPointPath, {
    ...njkOpts,
    ...opts,
    ...themeOpts
  });

  return njkContent
}