#!/usr/bin/env node
import { program } from 'commander';
import build from './build.js';
import start from './start.js';

// Get the current path
const APP_PATH = process.env.PWD;

// Default folder name
const DEFAULT_FOLDER = 'app';

// Configuration
const CONFIG = {
  route: APP_PATH,
  folderName: DEFAULT_FOLDER
}

// Run the build mode
build(program, CONFIG);

// Run the development mode
start(program, CONFIG);

program.parse(process.argv);