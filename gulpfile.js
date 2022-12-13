const pug = require('gulp-pug')
const gulp = require('gulp')
const rename = require('gulp-rename')
const data = require('gulp-data')
const connect = require('gulp-connect')
const replace = require('gulp-replace')
const ghPages = require('gulp-gh-pages')
const bower = require('gulp-bower')
const image = require('gulp-image')
const stylus = require('gulp-stylus')
const minify = require('gulp-minify')
const path = require('path')
const fs = require('fs')
const purgecss = require('gulp-purgecss')
// var cheerio = require('cheerio')

const build_dir = 'spanish-benchmark/' // good to have this be the same as the repo name for gh-pages purposes


gulp.task('bower', function () {
  return bower()
    .pipe(gulp.dest('./' + build_dir + 'bower_components/'))
})

gulp.task('purge_bootstrap', function () {
	return gulp.src('./' + build_dir + 'bower_components/bootstrap/**/*.css')
		.pipe(purgecss({ content: ['./' + build_dir + '*.html'] }))
		.pipe(gulp.dest('./' + build_dir + 'bower_components/bootstrap'))
})

gulp.task('purge_styles', function () {
	return gulp.src('./' + build_dir + 'stylesheets/*.css')
		.pipe(purgecss({ content: ['./' + build_dir + '*.html'] }))
		.pipe(gulp.dest('./' + build_dir + 'stylesheets'))
})

gulp.task('purgecss', gulp.series('purge_styles', 'purge_bootstrap'))

gulp.task('png', function () {
  return gulp.src('./views/images/*.png')
    .pipe(image())
    .pipe(gulp.dest('./' + build_dir + 'images'))
})

gulp.task('jpg', function () {
  return gulp.src('./views/images/*.jpg')
    .pipe(image())
    .pipe(gulp.dest('./' + build_dir + 'images'))
})

gulp.task('logo', function () {
	return gulp.src('./views/images/favicon.*')
		.pipe(image())
		.pipe(gulp.dest('./' + build_dir))
})

gulp.task('image', gulp.series('png', 'jpg', 'logo'))

gulp.task('js', function () {
  return gulp.src('./views/js/*')
    .pipe(minify())
    .pipe(gulp.dest('./' + build_dir + 'javascripts/'))
})

gulp.task('connect', async function () {
  await connect.server({
    host: 'localhost',
    root: './spanish-benchmark'
  })
})

gulp.task('generate_index', async function () {
  return await gulp.src('views/index.pug')
    .pipe(pug())
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('generate_datasets', async function () {
  var test_1 = require('./texts/datasets.json')
  return await gulp.src('views/datasets.pug')
      .pipe(data(function () {
        return { 'test1': test_1 }
      }))
    .pipe(pug())
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('generate_submit', async function () {
  return await gulp.src('views/submit.pug')
    .pipe(pug())
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('css', async function () {
  return  await gulp.src('./views/styles/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./' + build_dir + 'stylesheets'))
})

gulp.task('deploy', async function () {
  return gulp.src('./' + build_dir + '**/*')
    .pipe(ghPages())
})

gulp.task('generate', gulp.series('bower', 'generate_index', 'generate_submit', 'generate_datasets'))

gulp.task('correct_link_paths', gulp.series('generate'), async function () {
  return gulp.src('./' + build_dir + '**/*.html')
    .pipe(replace(/([^-](?:href|src)=[\'\"]\/)([^\'\"]*)([\'\"])/g, '$1' + build_dir + '$2$3'))
    .pipe(gulp.dest('./' + build_dir))
})
gulp.task('all', gulp.series('generate', 'correct_link_paths', 'image', 'logo', 'js', 'css', 'purgecss'))
gulp.task('default', gulp.series('generate_index', 'generate_submit', 'generate_datasets', 'correct_link_paths', 'js', 'css', 'purgecss'))

