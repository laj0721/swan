var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  cleanCSS = require('gulp-clean-css'),
  imageMin = require('gulp-imagemin'),
  htmlmin = require('gulp-htmlmin');

gulp.task('jsCompress', function() {
  gulp.src('web/**/*.js') 
  .pipe(uglify())
  .pipe(gulp.dest('build'));
});

gulp.task('cssCompress', function() {
  gulp.src('web/**/*.css') 
  .pipe(cleanCSS())
  .pipe(gulp.dest('build'));
});

gulp.task('image',function(){
  gulp.src('web/**/images/*.*')
  .pipe(imageMin({progressive: true}))
  .pipe(gulp.dest('build'));
});

gulp.task('htmlmin', function () {
  var options = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
  };
  gulp.src('web/**/*.html')
  .pipe(htmlmin(options))
  .pipe(gulp.dest('build'));
});

gulp.task('default', ['jsCompress', 'cssCompress', 'image', 'htmlmin']);