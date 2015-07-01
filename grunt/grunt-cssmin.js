module.exports = function(grunt) {
	grunt.config('cssmin', {		
		minify: {
			expand: true,
			cwd: '<%=config.css.cssDir%>/',
			src: ['*.css'],
			dest: '<%=config.css.cssDir%>/',
			// Can set to gzip?
			ext: '.css'
		}
	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');
};