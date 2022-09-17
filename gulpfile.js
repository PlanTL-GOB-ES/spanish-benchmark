var pug = require('gulp-pug')
var gulp = require('gulp')
var rename = require('gulp-rename')
var data = require('gulp-data')
var connect = require('gulp-connect')
var replace = require('gulp-replace')
var ghPages = require('gulp-gh-pages')
var bower = require('gulp-bower')
var image = require('gulp-image')
var stylus = require('gulp-stylus')
var minify = require('gulp-minify')
var path = require('path')
var fs = require('fs')
// var cheerio = require('cheerio')

var build_dir = 'spanish-benchmark/' // good to have this be the same as the repo name for gh-pages purposes


gulp.task('bower', function () {
  return bower()
    .pipe(gulp.dest('./' + build_dir + 'bower_components/'))
})

gulp.task('image', function () {
  return gulp.src('./views/images/*')
    .pipe(image())
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('js', function () {
  return gulp.src('./views/js/*')
    .pipe(minify())
    .pipe(gulp.dest('./' + build_dir + 'javascripts/'))
})

gulp.task('connect', async function () {
  await connect.server({
    host: '0.0.0.0',
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


gulp.task('default', gulp.series('generate', 'correct_link_paths', 'image', 'js', 'css'))


