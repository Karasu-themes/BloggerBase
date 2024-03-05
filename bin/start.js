import chalk from 'chalk';
import path from 'node:path';
import chokidar from 'chokidar';
import compiler from '../core/compiler.js';
import { writeBuild, getThemeConfig, getMode } from '../core/utils.js';

export default function start(program, route) {

  const bb = chalk.hex('#6366f1').bold;

  program.command('start')
    .description('Iniciamos el modo de desarrollo')
    .option('-m, --mode <mode>', 'Modo de uso')
    .action(async (opts) => {
      const entryPointApp = path.join(path.resolve(route, 'app'), 'app.ejs');
      const mode = opts.mode ?? "development";
      const config = await getThemeConfig(route);

      const watcher = chokidar.watch(['./app/**/*.{ejs,js,scss,sass,css}'], {
        ignoreInitial: true,
        ignored: /(^|[\/\\])\../,
        persistent: true
      });

      console.log(`${bb(`BloggerBase | version 2.0.0`)}\nCurrent mode: ${mode}`);
      console.log(chalk.italic(`Waiting for changes in the ${chalk.bold("./app")} folder.\n`));

      function startWatcher() {
        const compiled = compiler(entryPointApp, {
          ...getMode(mode),
          ...config
        });

        compiled.then(content => {
          writeBuild(content, config);
        });
      }

      watcher.on('add', startWatcher);
      watcher.on('change', startWatcher);
      watcher.on('unlink', startWatcher);
      watcher.on('addDir', startWatcher);
      watcher.on('unlinkDir', startWatcher);

    });
}