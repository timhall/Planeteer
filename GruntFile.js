module.exports = function (grunt) {
    
    // Project configuration
    grunt.initConfig({
        uglify: {
            cosmic: {
                src: 'js/lib/cosmic.js',
                dest: 'js/lib/cosmic.min.js'
            }
        },

        preprocess: {
            cosmic: {
                files: {
                    'js/lib/cosmic.js': 'js/cosmic/build/cosmic.js'
                }
            }
        },

        jasmine: {
            options: {
                specs: 'spec/**/*.spec.js'
            },
            cosmic: {
                src: []
            }
        }
    });

    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('cosmic', ['preprocess:cosmic', 'uglify:cosmic']);
    
    // grunt.registerTask('planeteer-test', ['jasmine:planeteer']);
    // grunt.registerTask('planeteer-build', []);

    // grunt.registerTask('default', ['jasmine:freebody', 'preprocess', 'concat', 'uglify']);
};
