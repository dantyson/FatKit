module.exports = function(grunt) {
	grunt.config('sass', {		
		// Compiles and compresses sass
        dist: {
            options: {
                // Dont create a .sass-cache folder
                noCache: true,
            	// Set to 'expanded' for debug purposes
                style: 'expanded',
            },
            files: {
                '<%=config.css.cssDir%>/style.css': '<%=config.css.sassDir%>/style.scss'
            }
        }
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
};