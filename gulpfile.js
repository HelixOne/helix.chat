var gulp = require('gulp');
var htmlreplace = require('gulp-html-replace');
var ghtmlSrc = require('gulp-html-src');
var uglify = require('gulp-uglify');
var debug = require('gulp-debug');
var less = require('gulp-less');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');



 
 var htmlSrc = 'www/app.html';
gulp.task('html', function() {
  gulp.src(htmlSrc)
    .pipe(htmlreplace({
        'css': ['css/app.css', 'css/bower.min.css',],
        'js': ['javascript/app.min.js'],
    }))
    .pipe(gulp.dest('./build/'));
});



gulp.task('copy-js', function() {
    gulp.src(htmlSrc)
        .pipe(ghtmlSrc())
        // From this point, it's as if you'd used gulp.src() listing each of your 
        // javascript files that are in your html as <script src="..."></script>
       //.pipe(function(x){console.log(x); return x})
       // .pipe(uglify({mangle: false}))
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('./build/javascript/'));

});

gulp.task('build_angular_template_cache', function() {
    gulp.src('www/components/**/*.html')
        .pipe(templateCache({
            module: 'app',
            transformUrl: function(url) {
                return 'components/' + url
            }
        }))
        .pipe(gulp.dest('./www/components/app/'));
});


gulp.task('copy-css', function() {
    gulp.src(htmlSrc)
        .pipe(ghtmlSrc({ presets: 'css'}))
        .pipe(concat('bower.min.css'))
        .pipe(gulp.dest('./build/css'));
});


gulp.task('less', function() {
    gulp.src(['./www/css/app.less'])
        .pipe(debug({ title: 'before'}))

        .pipe(less())
        .pipe(gulp.dest('./build/css/'));

});
gulp.task('default', ['html', 'build_angular_template_cache', 'copy-js','copy-css', 'less']);

