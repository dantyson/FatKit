module.exports = function(grunt) {
	grunt.config('csscomb', {		
		// Sort properties in all .scss files when saved
        // See config/csscomb.json for what it will do
        options: {
            config: 'config/csscomb.json'
        },
        examples: {
            expand: true,
            cwd: '<%=config.css.sassDir%>/',
            src: ['**/*.scss'],
            dest: '<%=config.css.sassDir%>/'
        }
	});

	grunt.loadNpmTasks('grunt-csscomb');
};