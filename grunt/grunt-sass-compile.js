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
                '<%=config.css.cssDir%>/<%=config.css.rootFile%>.css': '<%=config.css.sassDir%>/<%=config.css.rootFile%>.scss'
            }
        }
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
};