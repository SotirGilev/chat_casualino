var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    ts = require('gulp-typescript'),
    typescript = require('gulp-tsc');

// JSHint task
gulp.task('lint', function() {
    gulp.src('./chat/*.js')
        .pipe(jshint())
        // You can look into pretty reporters as well, but that's another story
        .pipe(jshint.reporter('default'));
});

// Browserify task
gulp.task('ts'/*'browserify'*/, function() {
    // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
    //gulp.src(['./app/*.js','./chat/*.js','./login/*.js'])
        // .pipe(browserify({
        //     insertGlobals: true,
        //     debug: true,
        //     mangle: true
        // }))
    // gulp.src(['./app/*.ts','./chat/*.ts','./login/*.ts'])
    //     .pipe(uglify())
    //
    //     // Bundle to a single file
    //     .pipe(concat('bundleTheFiles.js'))
    //     .pipe(ngAnnotate())
    //     // Output it to our dist folder
    //     .pipe(gulp.dest('./build'));
    gulp.src(['./app/index.ts','./app/*.ts','./chat/*.ts','./login/*.ts','./MenuCtrl.ts']) //they must be in the right order
        .pipe(ts({
            //noImplicitAny: true,
            outFile: 'bundle11.js',
            removeComments: true,
            allowJs: true
        }))
        //.pipe(uglify())
        // Bundle to a single file
        // .pipe(concat('bundleTheFiles.js'))
        .pipe(ngAnnotate())
        // Output it to our dist folder
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', ['lint'], function() {
    // Watch our scripts
    gulp.watch(['./app/*.js','./login/*.js','./chat/*.js'],[
        'lint',
        'ts'
    ]);
});