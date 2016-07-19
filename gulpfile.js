var gulp = require('gulp'),
    bower = require('gulp-bower'),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence'),
    frontMatter = require('gulp-front-matter'),
    rename = require('gulp-rename'),
    hb = require('gulp-hb'),
    minifyHTML = require('gulp-minify-html'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    uncss = require('gulp-uncss'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync'),
    ghPages = require('gulp-gh-pages'),
    _ = require('lodash');

gulp.task('default', function (callback) {

    runSequence('build',
        'watch',
        'browserSync',
        callback);

});

gulp.task('build', function (callback) {

    runSequence('clean',
        ['copy', 'handlebars', 'uglify:main'],
        'sass',
        callback);

});

gulp.task('handlebars', function () {

    return gulp.src('./src/*.hbs')
               .pipe(rename({
                   extname: ".html"
               }))
               .pipe(frontMatter({ // optional configuration
                   property: 'frontMatter', // property added to file object
                   remove: true // should we remove front-matter header?
               }))
               .pipe(hb({
                   debug: true,
                   bustCache: true,
                   data: './src/data/**.js',
                   helpers: ['./src/handlebars/*.js', './node_modules/handlebars-layouts/index.js'],
                   partials: './src/partials/*.hbs',
                   dataEach: function (context, file) {
                       // map frontMatter attributes directly in context without file as prefix
                       _.assign(context, file.frontMatter);
                       // add file meta information to context
                       context.fileAttr = {mtime: file.stat.mtime, shortPath: file.path.replace(file.cwd, '')};
                       return context;
                   }
               }))
               .pipe(minifyHTML())
               .pipe(gulp.dest('build'))
               .pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', ['bower'], function () {
    return gulp.src('./src/assets/css/design.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build/css'))
        .pipe(uncss({
            html: ['./build/*.html'],
            ignore: [/(tooltip|popover|scrollUp|collapse|collapsing|nav|btn|form|alert|fp-)+.*/]
        }))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('uglify:main', function () {
    return gulp.src(['./bower_components/jquery/dist/jquery.js', 'bower_components/jquery.easing/js/jquery.easing.js', './bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
        'bower_components/fullpage.js/dist/jquery.fullpage.js', './src/assets/js/main.js'])
               .pipe(uglify({compress: true}))
               .pipe(concat('main.js'))
               .pipe(gulp.dest('./build/js'))
               .pipe(browserSync.reload({stream: true}));
});
gulp.task('bower', function () {
    // fetch bower dependencies
    return bower();
});

gulp.task('watch', function () {
    watch(['./src/**/*.hbs', './src/data/**/*.js', './src/handlebars/**/*.js'], function () {
        gulp.run('handlebars');
    });
    watch(['./src/assets/css/**/*.less'], function () {
        gulp.run('less');
    });
    watch(['./src/assets/css/**/*.scss'], function () {
        gulp.run('sass');
    });
    watch(['./src/assets/js/main.js'], function () {
        gulp.run('uglify:main');
    });
    watch(['./src/assets/**', '!./src/assets/{css,js}{,/**}'], function () {
        gulp.run('copy');
    });
});

gulp.task('browserSync', function () {
    return browserSync.init({
        server: "./build",
        browser: "none"
    });
});

gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('copy', function () {
    return gulp.src(['./src/assets/**', '!./src/assets/css/**', , '!./src/assets/js/main.js', './CNAME'])
        .pipe(gulp.dest('build'));
});

gulp.task('publish', ['build'], function () {
    return gulp.src('./build/**/*')
        .pipe(ghPages());
});
