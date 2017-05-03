var gulp        = require('gulp'),
	plumber     = require('gulp-plumber'),
	browserSync = require('browser-sync').create(),
	stylus      = require('gulp-stylus'),
	uglify      = require('gulp-uglify'),
	concat      = require('gulp-concat'),
	jeet        = require('jeet'),
	koutoSwiss  = require('kouto-swiss'),
	prefixer    = require('autoprefixer-stylus'),
	imagemin    = require('gulp-imagemin'),
    htmlmin     = require('gulp-htmlmin'),
    clean       = require('gulp-clean'),
    del         = require('del');

/**
 * Stylus task
 */
gulp.task('stylus',['clean'],function(){
  gulp.src('src/styl/main.styl')
    .pipe(plumber())
    .pipe(stylus({
	  use:[koutoSwiss(), prefixer(), jeet()],
	  compress: true
    }))
    .pipe(gulp.dest('build/css/'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('build/css'));
});

/**
 * Javascript Task
 */
gulp.task('js',['clean'], function(){
  return gulp.src('src/js/**/*.js')
	.pipe(plumber())
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(gulp.dest('build/js/'))
    .pipe(browserSync.reload({stream:true}));
});

/**
 * Imagemin Task
 */
gulp.task('imagemin', function() {
  return gulp.src('src/img/**/*.{jpg,png,gif}')
	.pipe(plumber())
	.pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
	.pipe(gulp.dest('build/img/'))
	.pipe(browserSync.reload({stream:true}))
});

/**
 * html Task
 */
gulp.task('html',['clean'],function() {
  gulp.src('views/**/*.html')
	.pipe(htmlmin({
		collapseWhitespace: true,            //压缩html
		collapseBooleanAttributes: true,     //省略布尔属性的值
		removeComments: true,                //清除html注释
		removeEmptyAttributes: true,         //删除所有空格作为属性值
		removeScriptTypeAttributes: true,    //删除type=text/javascript
		removeStyleLinkTypeAttributes: true, //删除type=text/css
		minifyJS:true,                       //压缩页面js
		minifyCSS:true                       //压缩页面css
	}))
	.pipe(gulp.dest('build/dist'))
	.pipe(browserSync.reload({stream:true}));
});

gulp.task('clean',function(cb){
  return del(['build/*'],cb);
});

gulp.task('serve',function() {
  gulp.start('js','stylus','imagemin','html');
  browserSync.init({
	port: 2017,
	server: {
		baseDir: 'build/dist'
	}
  });
  gulp.watch('src/styl/**/*.styl', ['stylus']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/img/**/*.{jpg,png,gif}', ['imagemin']);
  gulp.watch('views/**/*.html', ['html']);
});

gulp.task('default',['serve']);
