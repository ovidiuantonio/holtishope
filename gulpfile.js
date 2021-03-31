// Initialize modules
const autofrefixer = require("autoprefixer");
const cssnano = require("cssnano");
const gulp = require("gulp");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const postcss = require("gulp-postcss");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();

// File path variables

const files = {
  scssPath: "src/scss/**/*.scss",
  jsPath: "src/js/**/*.js",
  htmlPath: "src/**/*.html",
  imgPath: "src/images/**/*",
};

// Copy HTML Files to the dist folder

function copyHtml() {
  return gulp.src(files.htmlPath).pipe(gulp.dest("dist"));
}

// Copy Images to the dist folder

function copyImg() {
  return gulp.src(files.imgPath).pipe(gulp.dest("dist/images"));
}

//  SASS task

function scssTask() {
  return gulp
    .src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(concat("style.scss"))
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
}

// JS task

function jsTask() {
  return gulp
    .src(files.jsPath)
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
}

// Watch task

function watchTask() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
  gulp.watch(files.scssPath, scssTask);
  gulp.watch(files.htmlPath).on("change", copyHtml, browserSync.reload);
  gulp.watch(files.jsPath, jsTask).on("change", browserSync.reload);
}

// Default task

exports.default = gulp.series(
  gulp.parallel(copyHtml, copyImg),
  gulp.parallel(scssTask, jsTask),
  watchTask
);
