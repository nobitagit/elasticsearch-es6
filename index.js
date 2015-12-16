var fs = require('fs')
var browserify = require('browserify')
var watchify = require('watchify')
var babelify = require('babelify')
var assign = require('lodash.assign')
var nodemon = require('nodemon')

var builds = [
	{
		_name: 'Server',
		_ignore: ['./app/'],
		_opts: {
			entries: ['server/index.js'],
			outfile: 'dist/server.js',
		  builtins: false,
		  browserField: false,
		  insertGlobalVars:
		   { process: undefined,
		     global: undefined,
		     'Buffer.isBuffer': undefined,
		     Buffer: undefined }
		}
	},
	{
		_name: 'App',
		_ignore: ['./server/'],
		_opts: {
			entries: ['app/index.js'],
			outfile: 'dist/app.js',
		  builtins: undefined,
		  browserField: true,
		  insertGlobalVars: undefined
		}
	}];

function startWatcher(build) {
	var opts = assign({
	  cache: {},
	  ignoreWatch: ['**/node_modules/**', './dist/'].concat(build._ignore),
	  packageCache: {},
	  plugin: [watchify, babelify],
	  debug: true
	}, build._opts);

	var b = browserify(opts);

	b.on('update', bundle);
	b.on('log', function (msg) {
		console.log('\x1b[32m [' + build._name + ']' + '\x1b[0m => ' + msg);
	});

	function bundle() {
	  b.bundle()
	  	.pipe(fs.createWriteStream(build._opts.outfile))
	}

	bundle();
	return build._name;
}

var watchedBuilds = builds.map(startWatcher);

// Nodemon conf.
nodemon({
  script: 'dist/server.js',
  ignore: ['dist/app.js', 'app/*']
});

nodemon.once('start', function () {
  console.log('Server has started.');
}).on('quit', function () {
  console.log('\nNodemon stopped. Press CMD+q to exit.');
}).on('restart', function (files) {
  console.log('Server restarted ( file changed: %s)', files);
});

console.log('Watching files. Ready to build ' + watchedBuilds.join(', ') );