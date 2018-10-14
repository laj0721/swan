var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  minifyCss = require('gulp-minify-css'),
  imageMin = require('gulp-imagemin'),
  htmlmin = require('gulp-htmlmin'),
  babel = require("gulp-babel"),
  sass = require('gulp-sass'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  rev = require('gulp-rev'), //- 对文件名加MD5后缀
  revCollector = require('gulp-rev-collector'); //- 路径替换

// gulp.task('es6ToEs5', function() {
//   gulp.src('web/**/*.js')
//   .pipe(babel()) 
//   .pipe(gulp.dest('develop'));
// });

// gulp.task('sassToCss', function () {
//   return gulp.src('web/**/*.css')
//     .pipe(gulp.dest('develop'));
// });

// gulp.task('imageDev',function(){
//   gulp.src('web/**/images/*.*')
//   .pipe(imageMin({progressive: true}))
//   .pipe(gulp.dest('develop'));
// });

// gulp.task('htmlDev', function () {
//   gulp.src('web/**/*.html')
//   .pipe(gulp.dest('develop'));
// });

// gulp.task('watch', function () {
//   // 监听文件修改，当文件被修改则执行
//   gulp.watch('web/**/*.js', ['es6ToEs5','browserify']);
//   gulp.watch('web/**/*.css', ['sassToCss']);
//   gulp.watch('web/**/images/*.*', ['image']);
//   gulp.watch('web/**/*.html', ['htmlDev']);
// });

// // browserify
// gulp.task("browserify", function () {
//   var b = browserify({
//       entries: "develop/home/js/index.js",
//       debug: true
//   });

//   return b.bundle()
//       .pipe(source("bundle.js"))
//       .pipe(gulp.dest("develop/home/js"));
// });

// gulp.task('dev', ['htmlDev', 'sassToCss', 'es6ToEs5', 'imageDev', 'browserify', 'watch']);


gulp.task('jsCompress', function() {
  gulp.src('web/**/*.js')
  .pipe(uglify())
  .pipe(rev())
  .pipe(gulp.dest('build'))
  .pipe(rev.manifest())
  .pipe(gulp.dest('rev/js'));
});

gulp.task('cssCompress', function() {
  gulp.src('web/**/*.css') 
  .pipe(minifyCss())
  .pipe(rev()) 
  .pipe(gulp.dest('build'))
  .pipe(rev.manifest())  //- 生成一个rev-manifest.json
  .pipe(gulp.dest('rev/css'));      
});

gulp.task('image',function(){
  gulp.src('web/**/images/*.{png,jpg,gif,ico}')
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

gulp.task('rev', function() {
  gulp.src(['rev/**/*.json', 'build/**/*.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
  .pipe(revCollector())   //- 执行文件内css名的替换
  .pipe(gulp.dest('build'));  //- 替换后的文件输出的目录
});

gulp.task('build', ['jsCompress', 'cssCompress', 'image', 'htmlmin']);