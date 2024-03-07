import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import chokidar from 'chokidar';
import compiler from '../core/compiler.js';
import { writeBuild, getThemeConfig, getMode } from '../core/utils.js';

export default function start(program, route) {

  const tempFolder = path.resolve(route, ".temp");
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

      console.log(`${bb(`BloggerBase | version 2.0.0`)}\nCurrent mode: ${chalk.bold(mode)}`);
      console.log(`Waiting for changes in the ${chalk.bold("./app")} folder.\n`);

      function startWatcher() {
        const compiled = compiler(entryPointApp, {
          ...getMode(mode),
          ...config
        });

        compiled.then(content => {
          writeBuild(content, config, tempFolder);
        });
      }

      watcher.on('add', startWatcher);
      watcher.on('change', startWatcher);
      watcher.on('unlink', startWatcher);
      watcher.on('addDir', startWatcher);
      watcher.on('unlinkDir', startWatcher);

    });

  // borramos la carpeta temporal para el modo desarrollo cuando 
  // terminamos la ejecución del comando con ctrl+c
  process.on('SIGINT', () => {
    if (fs.existsSync(tempFolder)) {
      fs.rmSync(tempFolder, { recursive: true, force: true });
    }
    process.exit(0);
  })
}