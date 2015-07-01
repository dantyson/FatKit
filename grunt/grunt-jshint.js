module.exports = function(grunt) {
	grunt.config('jshint', {		
		// Linter for javascript files
		// Will lint all files before they are concatenated into fatkit.js
		// relax options in config/.jshintrc
		options: {
			jshintrc: 'config/.jshintrc',
			force: true
		},

		beforeconcat: ['gruntfile.js', '<%=config.js.compDir%>/*.js', '<%=config.js.coreDir%>/*.js']
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
};