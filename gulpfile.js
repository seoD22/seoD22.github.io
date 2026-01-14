const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const cmq = require('postcss-combine-media-query');
const browserSync = require('browser-sync').create();

// [1] HTML 합치기
gulp.task('html', function() {
  return gulp.src(['src/**/*.html', '!src/inc/**/*.html'])
    .pipe(fileinclude({ prefix: '@@', basepath: '@file' }))
    .pipe(gulp.dest('docs'))
    .pipe(browserSync.stream());
});

// [2] SCSS 컴파일 + PostCSS(Autoprefixer 등)
gulp.task('scss', function() {
  const plugins = [
    cmq(),
    autoprefixer(),
    cssnano()
  ];
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('docs/css'))
    .pipe(browserSync.stream());
});

// [3] JS 및 Assets 복사
gulp.task('copy', function() {
  gulp.src('src/js/**/*').pipe(gulp.dest('docs/js'));
  return gulp.src('src/assets/**/*').pipe(gulp.dest('docs/assets'));
});

// [4] 실시간 감시 및 서버
gulp.task('serve', function() {
  browserSync.init({
    server: { 
      baseDir: "./docs" 
    },
    notify: false 
  });
  gulp.watch('src/**/*.html', gulp.series('html'));
  gulp.watch('src/scss/**/*.scss', gulp.series('scss'));
  gulp.watch(['src/js/**/*', 'src/assets/**/*'], gulp.series('copy')).on('change', browserSync.reload);
});

// 실행: npm run dev
gulp.task('default', gulp.series(gulp.parallel('html', 'scss', 'copy'), 'serve'));