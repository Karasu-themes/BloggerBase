import chokidar from 'chokidar';
import compiler from "./compiler.js";
import { writeBuild } from "./utils.js";
// import fs from "node:fs";

const watcher = chokidar.watch([
  './app/**/*.{ejs,js,scss,sass,css}',
], {
  ignoreInitial: true,
  ignored: /(^|[\/\\])\../,
  persistent: true
});

function startWatcher() {
  const compiled = compiler();
  compiled.then(content => {
    writeBuild(content);
  });
}

watcher.on('add', startWatcher);
watcher.on('change', startWatcher);
watcher.on('unlink', startWatcher);
watcher.on('addDir', startWatcher);
watcher.on('unlinkDir', startWatcher);