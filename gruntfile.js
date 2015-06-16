module.exports = function(grunt) {

    // Displays how long each task is taking when you run a build
    // To see every task run: grunt --verbose
    require('time-grunt')(grunt);

    'use strict';
    
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    // All configuration goes here
    grunt.initConfig({

        // Concatenate javascript
        concat: {
            dist: {
                src: [
                	// Core needs to come first as it contians the definition for FatKit
                	'assets/scripts/core/core.js',
                	// Include all files in the core folder
                    'assets/scripts/core/*.js',
                    // Include all files in the components folder, only really needed if going for full setup
                    // 'assets/scripts/components/*.js',
                ],
                dest: 'assets/scripts/fatkit.js',
            }
        },

        // Uglifying javascript
        uglify: {
            options: {
            	// Set to true for debug purposes
            	// TODO set different uglify tasks base on default / production grunt task
            	beautify: true,
                // Mangle variable names?
                mangle: true
            },
            my_target: {
                files: {
                    'assets/scripts/min/fatkit.min.js': ['assets/scripts/fatkit.js']
                }
            },

            components: {
                src: '*.js',
                cwd: 'assets/scripts/components/',
                dest: 'assets/scripts/components/min/',
                expand: true,
                ext: '.min.js',
            }
        },

        // Linter for javascript files
        // Will lint all files before they are concatenated into fatkit.js
        // then lint fatkit.min.js
        jshint: {
            options: {
                curly: false,
                eqeqeq: false,
                browser: true,
                force: true,
                node: true,
                strict: false,
                validthis: true,
                globals: {
                    jQuery: true
                },
                predef: [
                    'alert',
                    '$'
                ]
            },

            beforeconcat: ['gruntfile.js', 'assets/scripts/components/*.js', 'assets/scripts/core/*.js', 'assets/scripts/*.js'],
            afterconcat: ['assets/scripts/min/*.min.js']
        },

        // May need these in the future, however they could cause your website to explode, EVERYWHERE!
        // Used to remove all files and folders from the build directory
        // IMPORTANT: If you point it to the wrong directory in will wipe everything from the directory
        // clean: {
        //     dist: {
        //         options: {
        //             force: true
        //         },
        //         src: ['../build/**/*']
        //     }
        // },

        // Copies your production ready image, script and css assets to a production environment
        // copy: {
        //     main: {
        //         files: [
        //             {expand: true, flatten: true, cwd: 'app/', src: ['assets/scripts/build/production.min.js'], dest: '../build/assets/scripts', filter: 'isFile'},
        //             {expand: true, flatten: true, cwd: 'app/', src: ['assets/styles/css/style.css'], dest: '../build/assets/styles', filter: 'isFile'},
        //             {expand: true, cwd: 'app/assets/images_build/', src: ['**/*'], dest: '../build/assets/images', filter: 'isFile'}
        //         ]
        //     }
        // },

        // Compiles and compresses sass
        sass: {
            dist: {
                options: {
                    // Dont create a .sass-cache folder
                    noCache: true,
                	// Set to 'expanded' for debug purposes
                	// Set to 'compressed' for production
            		// TODO set different sass tasks base on default / production grunt task
                    style: 'expanded',
                },
                files: {
                    'assets/styles/css/style.css': 'assets/styles/sass/style.scss'
                }
            }
        },

        // Autoprefixes CSS
        autoprefixer: {
            dist: {
                files: {
                    'assets/styles/css/style.css' : 'assets/styles/css/style.css'
                }
            }
        },

        // Sort properties in all .scss files when saved
        // See config/csscomb.json for what it will do
        csscomb: {
            options: {
                config: 'config/csscomb.json'
            },
            examples: {
                expand: true,
                cwd: 'assets/styles/sass/',
                src: ['**/*.scss'],
                dest: 'assets/styles/sass/'
            }
        },

        // Live refresh in browser when HTML, CSS and JS files change
        // Will open new tab with site
        // In console will generate external url so you can live refresh on other devices 
        browserSync: {
            bsFiles: {
                src : ['assets/styles/css/*.css',
                       '*.html',
                       'assets/scripts/min/*.js'
                      ]

            },
            options: {
                watchTask: true,
                server: {
                    server: "./"
                }
            }
        },

        // IN PROGRESS
        // Lints all .scss files, see config file for what it expects!
        // If you have a sublime plugin doing this, feel free to comment out
        scsslint: {
            allFiles: [
                'assets/styles/sass/**/*.scss',
            ],
            options: {
                bundleExec: true,
                config: 'config/.scss-lint-test.yml',
                reporterOutput: null,
                colorizeOutput: true
            },
        },

        // Optimises images and overwrites source
        // You can set to write into a different folder, if youre into that kind of thing
        // Only set to run with the production task, so we dont use the account 2GB limit
        kraken: {
            options: {
                key: 'b248cf8d2110dc64bb2ad8767f01a921',
                secret: '477407e48256ff7f3bee1367b0937f9dd0624a70',
                lossy: true
            },

            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'assets/images/',
                    src: ['**/*.{png,jpg,jpeg,gif}'],
                    dest: 'assets/images/'
                }]
            }
        },

        // Watch commands
        watch: {

            // Enable live reload
            options: {
                livereload: true
            },

            // Live reloads all of the html files in the root directory
            files: ['*.html'],

            // Concatenates and uglifies all script files in the scripts directory
            appScripts: {
                files: ['assets/scripts/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },

            // Sorts and lints sass files, then complies and minifies and finally autoprefixes css
            css: {
                files: ['assets/styles/sass/**/*.scss', 'assets/styles/css/style.css'],
                tasks: ['newer:csscomb', 'scsslint', 'sass', 'autoprefixer'],
                options: {
                    spawn: false,
                }
            },
        }

        // Future testing task
        // mocha: {
        //      all: {
        //         src: ['tests/testrunner.html']
        //     },
        //     options : {
        //         run: true
        //     }
        // },
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-kraken');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-notify');
    // This can be added before tasks, so only files that have changed since the most successful build will be updated
    // e.g. newer:kraken would not optmise every single image every time, only one that had changed since the last successful run of the task
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-scss-lint');
    // grunt.loadNpmTasks('grunt-mocha');

    // 4. Future packages
    // jshint - now - maybe not needed, very strict, possibly too strict!
    // scss lint - now - nearly there -- need it to read config file, currently passing all files, even if there is errors!


    // Watch
    grunt.registerTask('default', ['browserSync', 'concat', 'uglify', 'watch']);

    // Post to production
    grunt.registerTask('production', ['browserSync', 'concat', 'kraken', 'uglify', 'watch']);

};