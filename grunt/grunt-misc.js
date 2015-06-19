module.exports = function(grunt) {
	// Misc tasks that dont require any config, just need loading
	
	// This can be added before tasks, so only files that have changed since the most successful build will be updated
    // e.g. newer:kraken would not optmise every single image every time, only one that had changed since the last successful run of the task
    grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-notify');
};