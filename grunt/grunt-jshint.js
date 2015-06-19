module.exports = function(grunt) {
	grunt.config('jshint', {		
		// Linter for javascript files
        // Will lint all files before they are concatenated into fatkit.js
        // then lint fatkit.min.js
        // relax options in config/.jshintrc
        options: {
            jshintrc: 'config/.jshintrc',
            force: true
        },

        beforeconcat: ['gruntfile.js', '<%=config.js.compDir%>/*.js', '<%=config.js.coreDir%>/*.js', '<%=config.js.rootDir%>/*.js'],
        afterconcat: ['<%=config.js.rootDir%>/min/*.min.js']
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
};