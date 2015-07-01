module.exports = function(grunt) {
	grunt.config('scsslint', {		
		// IN PROGRESS
		// Lints all .scss files, see config file for what it expects!
		// If you have a sublime plugin doing this, feel free to comment out
		allFiles: [
			'<%=config.css.sassDir%>/**/*.scss',
		],
		options: {
			bundleExec: true,
			config: "config/.scss-lint-test.yml",
			reporterOutput: null,
			colorizeOutput: true
		}
	});

	grunt.loadNpmTasks('grunt-scss-lint');
};