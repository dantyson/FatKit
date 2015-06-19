module.exports = function(grunt) {
	grunt.config('browserSync', {
        bsFiles: {
            src : ['<%=config.css.cssDir%>/*.css',
                   '*.html',
                   '<%=config.js.rootDir%>/min/*.js'
                  ]

        },
        options: {
            watchTask: true,
            server: {
                server: "./"
            }
        }
	});

	grunt.loadNpmTasks('grunt-browser-sync');
};