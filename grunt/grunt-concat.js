module.exports = function(grunt) {
	grunt.config('concat', {		
		dist: {
			src: [
				// Core needs to come first as it contains the definition for FatKit
				'<%=config.js.coreDir%>/core.js',
				// Include all files in the core folder
				'<%=config.js.coreDir%>/*.js',
			],
			dest: '<%=config.js.rootDir%>/<%=config.js.rootFile%>.js',
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
};