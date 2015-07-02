module.exports = function(grunt) {
	grunt.config('copy', {		
		// Copies your production ready script and css assets to a www folder
		// Enables you to copy updated files to test site quickly
		// No SASS files on test site / only minified javascript
		js: {
			files: [
				{
					expand: true,
					flatten: true,
					cwd: 'assets/',
					src: ['scripts/min/<%=config.js.rootFile%>.min.js'],
					dest: 'www/<%=config.js.rootDir%>/',
					filter: 'isFile'
				},
				{
					expand: true,
					flatten: true,
					cwd: 'assets/',
					src: ['scripts/components/min/*.js'],
					dest: 'www/<%=config.js.compDir%>/min',
					filter: 'isFile'
				}
			]
		},
		css: {
			files: [
				{
					expand: true,
					flatten: true,
					cwd: 'assets/',
					src: ['styles/css/<%=config.css.rootFile%>.css'],
					dest: 'www/assets/styles/css',
					filter: 'isFile'
				}
			]
		},
		fonts: {
			files: [
				{
					expand: true,
					flatten: true,
					cwd: 'assets/',
					src: ['<%=config.fonts.rootDir%>/**/*.{woff,woff2,ttf,eot,otf}'],
					dest: 'www/<%=config.fonts.rootDir%>',
					filter: 'isFile'
				}
			]
		},
		images: {
			files: [
				{
					expand: true,
					flatten: true,
					cwd: 'assets/',
					src: ['<%=config.images.rootDir%>/**/*.{png,jpg,jpeg,gif,svg,bmp}'],
					dest: 'www/<%=config.images.rootDir%>',
					filter: 'isFile'
				}
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
};