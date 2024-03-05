import path from 'node:path';
import fs from 'node:fs';
import { compileStyles } from './style-compile.js';

function loadFileSync ( pathFile ) {
  if (fs.existsSync(pathFile)) return fs.readFileSync( pathFile, 'utf8' );
  return "";
}

export async function cssBuild( srcFile, {lang, style, plugins}) {
  const pathFile = path.join(path.resolve('./app/assets/'), srcFile);
  const fileData = loadFileSync(pathFile);
  const compiled = await compileStyles(fileData, lang, style, plugins);

  return compiled
}