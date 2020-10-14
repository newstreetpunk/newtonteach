newtonteach: {
		port: ++port,

		base: base.newtonteach,
		dest: base.newtonteach,

		styles: {
			src:    base.newtonteach + '/resources/' + preprocessor + '/**/*',
			dest:   base.newtonteach + '/public/css',
			output: 'main.min.css',
		},

		scripts: {
			src: [
				'node_modules/jquery/dist/jquery.min.js',
				base.newtonteach + '/resources/libs/timer/timer.js',
				'node_modules/slick-carousel/slick/slick.js',
				base.newtonteach + '/resources/js/common.js',
			],
			dest:       base.newtonteach + '/public/js',
			output:     'scripts.min.js',
		},

		images: {
			src:  base.newtonteach + '/resources/img/**/*',
			dest: base.newtonteach + '/public/img',
		},

		code: {
			src: [
				base.newtonteach  + '/**/*.{' + fileswatch + '}'
			],
		},
		forProd: [
			'/**',
			' * @author https://github.com/newstreetpunk',
			' * @author https://github.com/alexsab',
			' */',
			''].join('\n'),
	},


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
	.pipe(eval(preprocessor)({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(concat(projects.newtonteach.styles.output))
	.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'] }))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(dest(projects.newtonteach.styles.dest))
	.pipe(browserSync.stream())

};

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