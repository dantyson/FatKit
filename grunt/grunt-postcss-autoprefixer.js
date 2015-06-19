module.exports = function(grunt) {
	grunt.config('postcss', {		
        // Autoprefixes CSS
        options: {
            map: true,
            processors: [
                require('autoprefixer-core')({browsers: 'last 2 versions'})
            ]
        },
        dist: {
            src: '<%=config.css.cssDir%>/style.css'
        }
	});

	grunt.loadNpmTasks('grunt-postcss');
};