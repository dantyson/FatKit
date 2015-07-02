 // Global Grunt vars
 // Many of the Grunt tasks use these vars. Change as much as you like :)
 // If you ever change your folder structure, change these

module.exports = {

	taskSrc : "grunt/*.js", // This directory. Has all the Grunt tasks grouped into specific js files

	srcDir  : 'assets',  // <%=config.srcDir%>

	js : {
		rootDir  : '<%=config.srcDir%>/scripts', // <%=config.js.rootDir%>
		coreDir  : '<%=config.js.rootDir%>/core', // <%=config.js.coreDir%>
		compDir  : '<%=config.js.rootDir%>/components', // <%=config.js.compDir%>

		// Renaming this changes the name of the generated JS file
		// Make sure you update your template file
		rootFile : 'fatkit', // <%=config.js.rootFile%>
	},

	// CSS-related Grunt vars
	css : {
		sassDir  : '<%=config.srcDir%>/styles/sass', // <%=config.css.sassDir%>
		cssDir   : '<%=config.srcDir%>/styles/css', // <%=config.css.cssDir%>

		// Renaming this changes the name of the generated CSS file
		// Make sure you update your template file
		rootFile : 'style', // <%=config.css.rootFile%>
	},

	// Font files
	fonts : {
		rootDir	 : '<%=config.srcDir%>/fonts' // <%=config.fonts.rootDir%>
	},

	img : {
		rootDir	 : '<%=config.srcDir%>/images', // <%=config.img.rootDir%>
	}

};
