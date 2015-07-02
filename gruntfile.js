module.exports = function(grunt) {

	// Yeah do this
	'use strict';

	// Displays how long each task is taking when you run a build
	// To see every task run: grunt --v
	require('time-grunt')(grunt);

	var options = {
		// Global Grunt vars. Edit this file to change vars
		config : require('./grunt/grunt-config.js')
	};

	// Load grunt configurations automatically
	var configs = require('load-grunt-configs')(grunt, options);

	// Define the configuration for all the tasks
	// found in grunt/grunt-config.js
	grunt.initConfig(configs);

	// Load all our tasks from the grunt folder
	// Add any custom tasks / change the config of exisiting ones into this folder
	grunt.loadTasks('grunt');

	// No need to tell Grunt about all tasks seperatly, this will match all tasks installed in your dependencies
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
	

	/* ------------------------------------------------------------------
		Build setups - Re-name / add more / tweak if you wish
	-------------------------------------------------------------------*/

	// Dev grunt task - run grunt dev
	grunt.registerTask('dev', ['concat', 'uglify:dev', 'sass', 'browserSync', 'watch']);

	// Post to production - run grunt production
	grunt.registerTask('production', ['concat', 'uglify:live', 'uglify:components', 'sass', 'postcss', 'cssmin', 'newer:kraken', 'copy:css', 'copy:js', 'copy:fonts', 'copy:images']);

	// Validate scss / js files - run grunt check
	grunt.registerTask('check', ['scsslint', 'jshint']);

};