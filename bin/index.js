#!/usr/bin/env node
import { CONFIG } from '../core/config.js';
import { program } from 'commander';
import build from './build.js';
import start from './start.js';

// Run the build mode
build(program, CONFIG);

// Run the development mode
start(program, CONFIG);

program.parse(process.argv);