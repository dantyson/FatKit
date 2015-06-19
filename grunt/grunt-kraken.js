module.exports = function(grunt) {
	grunt.config('kraken', {		
		// Optimises images and overwrites source
        // You can set to write into a different folder, if youre into that kind of thing
        // Only set to run with the production task, so we dont use the account 2GB limit
        options: {
            key: 'b248cf8d2110dc64bb2ad8767f01a921',
            secret: '477407e48256ff7f3bee1367b0937f9dd0624a70',
            lossy: true
        },

        dynamic: {
            files: [
                {
                    expand: true,
                    cwd: '<%=config.img.srcDir%>',
                    src: ['**/*.{png,jpg,jpeg,gif,svg}'],
                    dest: '<%=config.img.srcDir%>'
                }
            ]
        }
	});

	grunt.loadNpmTasks('grunt-contrib-kraken');
};