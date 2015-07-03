module.exports = function(grunt) {
	grunt.config('watch', {		
		// Watch commands
		// Enable live reload
		options: {
			livereload: true
		},

		// Live reloads all of the html files in the root directory
		files: ['*.html'],

		// Concatenates and uglifies all script files in the scripts directory, then copies minified files to www folder
		appScripts: {
			files: ['<%=config.js.rootDir%>/*.js', '<%=config.js.coreDir%>/*.js', '<%=config.js.compDir%>/*.js'],
			tasks: ['concat', 'uglify:dev', 'uglify:componentDev'],
			options: {
				spawn: false,
			},
		},

		// Sorts and lints changed sass files, compliles, autoprefixes, minifies and then copies to www folder
		// TODO: re-enable csscomb once v4.0 is released (watching on github for updates)
		css: {
			files: ['<%=config.css.sassDir%>/**/*.scss', '<%=config.css.cssDir%>/<%=config.css.rootFile%>.css'],
			tasks: [/*'newer:csscomb',*/'sass', 'newer:postcss'],
			options: {
				spawn: false,
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
};