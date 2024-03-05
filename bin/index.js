#!/usr/bin/env node
import { program } from 'commander';
import build from './build.js';
import start from './start.js';

// Obtenemos la ruta actual
const APP_PATH = process.env.PWD;

// Ejecutar el modo de compilación
build(program, APP_PATH);

// Ejecutamos el modo desarrollo
start(program, APP_PATH);

program.parse(process.argv);