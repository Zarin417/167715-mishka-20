const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const minify = require("gulp-minify");
const del = require("del");
const htmlmin = require("gulp-htmlmin");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// MinifyHTML

const minifyHtml = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
};

exports.minifyHtml = minifyHtml;

// Minify JS

const minifyJs = () => {
  return gulp.src("source/js/**")
    .pipe(minify({
      ext: {
        min: ".min.js"
      }
    }))
    .pipe(gulp.dest("build/js"));
};

exports.minifyJs = minifyJs;

// Images optimisation

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
};

exports.images = images;

// Conversion images (png,jpg) to webp

const toWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 85}))
    .pipe(gulp.dest("source/img"));
};

exports.toWebp = toWebp;

// Create svg sprite

const sprite = () => {
  return gulp.src(["source/img/**/icon-*.svg", "source/img/**/logo-*.svg"])
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

exports.sprite = sprite;

// Copy to production folder

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**"
  ], {
      base: "source"
  })
    .pipe(gulp.dest("build"));
};

exports.copy = copy;

// Remove production folder

const clean = () => {
  return del("build");
};

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Create production folder

const build = gulp.series(
  clean, copy, styles,minifyHtml, minifyJs, sprite
);

exports.build = build;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/*.js", gulp.series("minifyJs"));
  gulp.watch("source/*.html", gulp.series("minifyHtml"));
  gulp.watch("build/*.html").on("change", sync.reload);
  gulp.watch("build/css/*.min.css").on("change", sync.reload);
  gulp.watch("build/js/*.min.js").on("change", sync.reload);
};

exports.default = gulp.series(
  build, server, watcher
);
