module.exports = function(grunt) {

    grunt.initConfig({

        wiredep: {
            target: {
                src: ['./www/app.html']
            }
        },
        injector: {
            options: {
                transform: function(filepath) {
                   filepath = filepath.replace('www/', '')
                    var e = filepath.split('.').slice(-1)[0];
                     console.log(filepath)
                    if (e === 'css') {
                        return '<link rel="stylesheet" href="' + filepath + '">';
                    } else if (e === 'js') {
                        return '<script src="' + filepath + '"></script>';
                    } else if (e === 'html') {
                        return '<link rel="import" href=\'' + filepath + ' \'>';
                    }
                }
            },
            local_dependencies: {

                files: {
                    'www/app.html': ['www/components/**/*.js'],
                }
            }
        }
    })
    grunt.loadNpmTasks('grunt-wiredep');

    grunt.loadNpmTasks('grunt-injector');

    grunt.registerTask('default', ['wiredep', 'injector']);

};
