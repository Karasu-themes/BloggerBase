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
  var env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.resolve(path.join(CONFIG.route, CONFIG.folderName)))
  );

  /**
   * Custom tags: binclude
   * This custom tag fixes the indentation error caused when including files inside app.{njk,html,xml}
   * by adding some hacks, we can fix the visual error and return the correct indentation level.
   */
  function BloggerInclude() {
    this.tags = ['binclude'];

    this.parse = function (parser, nodes) {
      const tok = parser.nextToken();

      const args = parser.parseSignature(null, true);
      parser.advanceAfterBlockEnd(tok.value);

      return new nodes.CallExtension(this, 'run', args);
    }

    this.run = function (context, url) {
      const content = env.render(url);
      return new nunjucks.runtime.SafeString(content.replace(/\n/g, '\n' + ' '.repeat(6)));
    }
  }

  env.addExtension('BloggerInclude', new BloggerInclude());

  // Render nunjucks files
  const njkContent = env.render(entryPointPath, {
    ...njkOpts,
    ...opts,
    ...themeOpts
  });

  return njkContent
}