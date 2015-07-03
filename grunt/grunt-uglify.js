module.exports = function(grunt) {
	grunt.config('uglify', {		
		dev: {
			options: {
				// Set to true for debug purposes
				beautify: true,
				// Mangle variable names?
				mangle: false,
			},
			files: {
				'<%=config.js.rootDir%>/min/<%=config.js.rootFile%>.min.js': ['<%=config.js.rootDir%>/<%=config.js.rootFile%>.js']
			}
		},

		live: {
			options: {
				// Set to true for debug purposes
				beautify: false,
				// Mangle variable names?
				mangle: true
			},
			files: {
				'<%=config.js.rootDir%>/min/<%=config.js.rootFile%>.min.js': ['<%=config.js.rootDir%>/<%=config.js.rootFile%>.js']
			}
		},

		// The components js files, can just be included on a page by page basis
		// so we dont need to roll these into fatkit.min.js, the can have their own .min.js

		componentDev: {
			options: {
				// Create sourcemaps for debugging purposes
				sourceMap: true
			},
			files: [{
				expand: true,
				cwd: '<%=config.js.compDir%>/',
				src: '*.js',
				dest: '<%=config.js.compDir%>//min/',
				ext: '.min.js'
			}]
		},

		componentLive: {
			options: {
				// Get rid of console logs for production
				drop_console: true
			},
			files: [{
				expand: true,
				cwd: '<%=config.js.compDir%>/',
				src: '*.js',
				dest: '<%=config.js.compDir%>/min/',
				ext: '.min.js'
			}]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
};