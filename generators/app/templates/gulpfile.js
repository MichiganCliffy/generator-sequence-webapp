var babelify = require('babelify'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    compass = require('gulp-compass'),
    envify = require('envify'),
    fs = require('fs'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    htmlmin = require('gulp-htmlmin'),
    nano = require('gulp-cssnano'),
    readdir = require('recursive-readdir'),
    s3 = require('gulp-s3'),
    server = require('gulp-server-livereload'),
    source = require('vinyl-source-stream'),
    tokens = require('gulp-token-replace'),
    uglify = require('gulp-uglify'),
    uglifyify = require('uglifyify');

function squelch(err) {
  console.log('> Error:');
  console.log(err.toString());
  this.emit('end');
};

gulp.task('default', ['build', 'watch', 'server']);
gulp.task('build', ['html', 'scripts', 'scss']);

gulp.task('watch', function() {
  gulp.watch(['./src/js/**/**'], ['scripts']);
  gulp.watch('./src/html/**/**', ['html']).on('error', squelch);
  gulp.watch('./src/scss/**/**', ['scss']).on('error', squelch);
});

gulp.task('scripts', function() {
  return browserify({
      entries: ['./src/js/app.js'],
      extensions: ['.jsx', '.json'],
      transform: [
        [babelify.configure({ presets: ['es2015', 'react'] })],
        [envify],
        [uglifyify]
      ],
      debug : process.env.NODE_ENV !== 'production'
    })
    .bundle()
    .on('error', function(err) {
      console.log(err.message);
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpif(process.env.NODE_ENV === 'production', uglify()))
    .on('error', squelch)
    .pipe(gulp.dest('./public/assets/js/'));
});

gulp.task('scss', function() {
  return gulp
    .src('src/scss/*.scss')
    .pipe(compass({
      css: './public/assets/css/',
      sass: './src/scss/',
      comments: false
    }))
    .on('error', squelch)
    .pipe(gulpif(process.env.NODE_ENV === 'production', nano()))
    .pipe(gulp.dest('./public/assets/css/'));
});

gulp.task('html', function(cb) {
  readdir('./public/assets/img', ['.DS_Store', '.gitkeep'], function(err, files) {
    var images = [];

    files.forEach(function(f) {
      images.push(['<img data-src="', f.replace(/^public/, ''), '"/>'].join(''));
    });

    gulp
      .src('./src/html/**/*')
      .pipe(tokens({ tokens: { images: images.join('') }}))
      .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
      .on('error', squelch)
      .pipe(gulp.dest('./public/'))
      .on('end', cb);
  });
});

gulp.task('server', function() {
  return gulp
    .src('./public')
    .pipe(server({
      host: '0.0.0.0',
      livereload: {
        enable: true
      }
    }));
});

function deploy(target, cb) {
  gulp
    .src([
      'public/mvp',
      'public/qb',
      'public/rookie',
      'public/umvp',
      'public/uqb',
      'public/urookie'
    ])
    .pipe(s3(target, {
      headers: {
        'x-amz-acl': 'public-read',
        'Content-Type': 'text/html'
      }
    }));

  gulp
    .src([
      'public/*.html',
      'public/*.png',
      'public/*.ico'
    ])
    .pipe(s3(target, {
      headers: {
        'x-amz-acl': 'public-read'
      }
    }));

  gulp
    .src([
      'public/assets/**'
    ])
    .pipe(s3(target, {
      uploadPath: '/assets/',
      headers: {
        'x-amz-acl': 'public-read'
      }
    }))
    .on('end', cb);
};

gulp.task('deploy.staging', ['build'], function(cb) {
  var target = JSON.parse(fs.readFileSync('./aws.json')).staging;
  return deploy(target, cb);
});

gulp.task('deploy.production', ['build'], function(cb) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error('Must set NODE_ENV to production');
    return;
  }

  var target = JSON.parse(fs.readFileSync('./aws.json')).production;
  return deploy(target, cb);
});
