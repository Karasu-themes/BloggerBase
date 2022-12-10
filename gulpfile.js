// Plugins
const { series, dest, src, watch } = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const UglifyJS = require('uglify-js');
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const sass = gulpSass(dartSass);
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const purgecss = require('@fullhuman/postcss-purgecss');
const fs = require('fs');


// Config
const utilsEjs = require('./utils.ejs');
const themeOpts = require('./config.theme');
const { name, version } = require('./package.json');

// purge config
const purgecfg = {
  content: ["./src/**/*.ejs", "./bundle/*.xml"],
  defaultExtractor: (content) => content.match(/[\w-/.:]+(?<!\.|:)/g) || [],
  safelist: [/* safelist here */]
}

/* custom loader */
ejs.__EJS__.fileLoader = function (filePath) {
  const content = fs.readFileSync(filePath);
  if (/(\.js)$/i.test(filePath)) {
    return UglifyJS.minify(fs.readFileSync(filePath, 'utf-8')).code
  } else {
    return content
  }
}

// Dir path
const dir = {
  ejs: {
    input: './src/main.ejs',
    output: './bundle/',
  },
  css: {
    input: './src/scss/main.scss',
    output: './bundle/css/',
  }
}

// tasks
function ejsBuild() {
  return src(dir.ejs['input'])
    .pipe(ejs({
      ...utilsEjs,
      ...themeOpts,
      name: name,
      version: version
    }))
    .pipe(rename({ extname: ".xml" }))
    .pipe(dest(dir.ejs['output']))
}

function css () {
  const {css} = dir;
  return src(css.input)
  .pipe(sass())
  .pipe(postcss([cssnano(), autoprefixer(), purgecss(purgecfg)]))
  .pipe(dest(css.output))
}

exports.css = css;
exports.ejs = series(css, ejsBuild);

exports.dev = function () {
  return watch([
    './src/**/*.ejs',
    './src/**/*.css',
    './src/**/*.scss',
    './src/**/*.sass',
    './src/**/*.js'
  ], series(css, ejsBuild))
}