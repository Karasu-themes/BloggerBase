import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { CONFIG } from '../core/config.js';
import chokidar from 'chokidar';
import compilerXML from '../core/compiler-xml.js';
import { writeBuild, getThemeConfig, getMode, getPackageJson, timeStamp } from '../core/utils.js';
import compilerStyles from '../core/compiler-styles.js';
import compilerScripts from '../core/compiler-scripts.js';

export default function start(program, { route, folderName }) {

  const tempFolder = path.resolve(route, ".temp");
  const bb = chalk.hex('#6366f1').bold;

  program.command('start')
    .description('Start the development mode')
    .option('-m, --mode <mode>', 'Mode use')
    .action(async (opts) => {
      const cache = {};
      const mode = opts.mode ?? "development";
      const { version } = getPackageJson();
      const config = await getThemeConfig(route);
      const watcher = chokidar.watch(
        [`./${CONFIG.folderName}/**/*.{xml,njk,html,js,scss,sass,css}`],
        {
          ignoreInitial: true,
          ignored: /(^|[\s\/\\])(?!\_)\../,
          persistent: true
        });

      console.log(`${bb(`BloggerBase | version ${version}`)}\nCurrent mode: ${chalk.bold(mode)}`);
      console.log(`Waiting for changes in the ${chalk.bold(`./${folderName}`)} folder.\n`);

      async function watcherEvent() {
        const startTime = new Date();
        let compiled = await compilerXML({ ...getMode(mode) });

        compiled = await compilerStyles(compiled, { ...{ modes: getMode(mode) } });
        compiled = await compilerScripts(compiled, { ...{ modes: getMode(mode) } });

        writeBuild(compiled, config, tempFolder);

        const endTime = new Date();
        console.log(`Built in ${chalk.green(timeStamp(startTime, endTime))}`);
      }

      watcher.on('add', watcherEvent);
      watcher.on('change', watcherEvent);
      watcher.on('unlink', watcherEvent);
      watcher.on('addDir', watcherEvent);
      watcher.on('unlinkDir', watcherEvent);
    });

  // We delete the .temp folder when stopped the command with CTRL+c
  process.on('SIGINT', () => {
    if (fs.existsSync(tempFolder)) {
      fs.rmSync(tempFolder, { recursive: true, force: true });
    }
    process.exit(0);
  })
}