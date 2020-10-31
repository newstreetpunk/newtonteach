// VARIABLES & PATHS
let preprocessor = 'sass', // Preprocessor (sass, scss, less, styl)
    fileswatch   = 'html,htm,txt,json,md,woff2,php', // List of files extensions for watching & hard reload (comma separated)
    pageversion  = 'html,htm,php', // List of files extensions for watching change version files (comma separated)
    imageswatch  = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
    online       = true, // If «false» - Browsersync will work offline without internet connection
    basename     = require('path').basename(__dirname),
    forProd      = [
					'/**',
					' * @author Alexsab.ru',
					' */',
					''].join('\n');

const { src, dest, parallel, series, watch, task } = require('gulp'),
	sass           = require('gulp-sass'),
	sourcemaps     = require('gulp-sourcemaps'),
	cleancss       = require('gulp-clean-css'),
	concat         = require('gulp-concat'),
	browserSync    = require('browser-sync').create(),
	uglify         = require('gulp-uglify-es').default,
	autoprefixer   = require('gulp-autoprefixer'),
	imagemin       = require('gulp-imagemin'),
	newer          = require('gulp-newer'),
	rsync          = require('gulp-rsync'),
	del            = require('del'),
	connect        = require('gulp-connect-php'),
	header         = require('gulp-header'),
	notify         = require('gulp-notify'),
	rename         = require('gulp-rename'),
	responsive     = require('gulp-responsive'),
	pngquant       = require('imagemin-pngquant'),
	merge          = require('merge-stream'),
	// version        = require('gulp-version-number'),
	// revAll         = require('gulp-rev-all'),
	replace        = require('gulp-replace');

if(typeof projects == 'undefined') 
	global.projects = {};
if(typeof port == 'undefined') 
	global.port = 8100;


projects.newtonteach = {

	port: ++port,

	base: basename,
	dest: basename,

	styles: {
		src:    basename + '/resources/' + preprocessor + '/**/*',
		dest:   basename + '/public/css',
		output: 'main.min.css',
	},

	scripts: {
		src: [
			'node_modules/jquery/dist/jquery.min.js',
			basename + '/resources/libs/timer/timer.js',
			'node_modules/slick-carousel/slick/slick.js',
			basename + '/resources/js/common.js',
		],
		dest:       basename + '/public/js',
		output:     'scripts.min.js',
	},

	images: {
		src:  basename + '/resources/img/**/*',
		dest: basename + '/public/img',
	},

	code: {
		src: [
			basename  + '/**/*.{' + fileswatch + '}'
		],
	},
	forProd: [
		'/**',
		' * @author https://github.com/newstreetpunk',
		' * @author https://github.com/alexsab',
		' */',
		''].join('\n'),
}


/* newtonteach START */

// Local Server
function newtonteach_browsersync() {
	connect.server({
		port: projects.newtonteach.port,
		base: projects.newtonteach.base,
	}, function (){
		browserSync.init({
			//server: { baseDir: projects.kia.base + '/' },
			proxy: '127.0.0.1:' + projects.newtonteach.port,
			notify: false,
			online: online
		});
	});
};

// Styles
function newtonteach_styles() {
	return src(projects.newtonteach.styles.src)
	.pipe(sourcemaps.init())
	.pipe(eval(preprocessor)({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(concat(projects.newtonteach.styles.output))
	.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'] }))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(sourcemaps.write())
	.pipe(dest(projects.newtonteach.styles.dest))
	.pipe(browserSync.stream())

};

// exports.newtonteach_versioningCss = () => {
//   return src(projects.newtonteach.code.src)
//     .pipe(replace(/(.*)\.css\?(v=.+&)*(.*)/g, '$1.css?v='+makeid()+'&$3'))
//     .pipe(replace(/(.*)\.css\"(.*)/g, '$1.css?v='+makeid()+'"$2'))
//     .pipe(replace(/(.*)\.css\'(.*)/g, '$1.css?v='+makeid()+'\'$2'))
//     .pipe(dest(function (file) {
//         return file.base;
//     }));
// };

// exports.newtonteach_versioningJs = () => {
//   return src(projects.newtonteach.code.src)
//     .pipe(replace(/(.*)\.js\?(v=.+&)*(.*)/g, '$1.js?v='+makeid()+'&$3'))
//     .pipe(replace(/(.*)\.js\"(.*)/g, '$1.js?v='+makeid()+'"$2'))
//     .pipe(replace(/(.*)\.js\'(.*)/g, '$1.js?v='+makeid()+'\'$2'))
//     .pipe(dest(function (file) {
//         return file.base;
//     }));
// };

// exports.newtonteach_versioningImage = () => {
//   return src(projects.newtonteach.code.src)
//     .pipe(replace(/(.*)\.(png|jpg|jpeg|gif)\?(_v=.+&)*(.*)/g, '$1.$2?v='+makeid()+'&$4'))
//     .pipe(replace(/(.*)\.(png|jpg|jpeg|gif)\"(.*)/g, '$1.$2?v='+makeid()+'"$3'))
//     .pipe(replace(/(.*)\.(png|jpg|jpeg|gif)\'(.*)/g, '$1.$2?v='+makeid()+'\'$3'))
//     .pipe(dest(function (file) {
//         return file.base;
//     }));
// };

// Scripts
function newtonteach_scripts() {
	return src(projects.newtonteach.scripts.src)
	.pipe(concat(projects.newtonteach.scripts.output))
	.pipe(uglify()) // Minify js (opt.)
	.pipe(header(projects.newtonteach.forProd))
	.pipe(dest(projects.newtonteach.scripts.dest))
	.pipe(browserSync.stream())
};

// Images
function newtonteach_images() {
	return src(projects.newtonteach.images.src)
	.pipe(newer(projects.newtonteach.images.dest))
	.pipe(imagemin([
            pngquant(),            
        ],{
            verbose: true
        }))
	.pipe(dest(projects.newtonteach.images.dest))
}
function newtonteach_cleanimg() {
	return del('' + projects.newtonteach.images.dest + '/**/*', { force: true })
}

// Watch
function newtonteach_watch() {
	watch(projects.newtonteach.styles.src, newtonteach_styles);
	watch(projects.newtonteach.scripts.src, newtonteach_scripts);
	// watch(projects.newtonteach.images.src, newtonteach_cleanimg); // почему закоменчено?
	watch(projects.newtonteach.images.src, newtonteach_images);
	watch(projects.newtonteach.code.src).on('change', browserSync.reload);
};

exports.newtonteach_cleanimg = newtonteach_cleanimg;
exports.newtonteach = parallel(newtonteach_images, newtonteach_styles, newtonteach_scripts, newtonteach_browsersync, newtonteach_watch);

/* newtonteach END */
