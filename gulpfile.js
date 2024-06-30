// gulpfile.js

const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('build', function() {
  return gulp.src('src/**/*.js') // Adjust the source pattern to match your project
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('dist')); // Output to 'dist' directory
});

gulp.task('default', gulp.series('build'));
