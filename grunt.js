
module.exports = function ( grunt ) {
    var path = 'lightplayer/media/lightplayer';

    grunt.initConfig({
      concat: {
        dist: {
          src: [path+'/js/*.js'],
          dest: path+'/build/src.js'
        },

        css: {
          src: [path+'/css/*.css'],
          dest: path+'/build/src.css'
        }
      },

      lint: {
        files: [path+'/js/*.js']
      },

      min: {
        dist: {
          src: [path+'/build/src.js'],
          dest: path+'/build/min.js'
        }
      },

      cssmin: {
        dist: {
          src: [path+'/build/src.css'],
          dest: path+'/build/min.css'
        }
      },

      server: {
        debug: true,
        port: 8088,
        base: './lightplayer'
      }
    });

  grunt.registerTask('jsmin', 'min');
  grunt.registerTask('jslint', 'lint');

  grunt.registerTask('build', 'jslint concat jsmin cssmin');

  grunt.registerTask('test', 'server');

  grunt.registerTask('phantom', function () {
    var url = 'http://localhost:8088/media/lightplayer/tests/runner.html',
        done = this.async();

    grunt.utils.spawn( { cmd : 'phantomjs', args: ['./scripts/jasmine.js', url] }, function ( err, result, code ) {
        grunt.log.writeln( err );
        grunt.log.writeln( result );
        
        if ( code ) {
            grunt.warn( 'erro', code );
        }

        done();
    });
  });

  grunt.registerTask('browser', function () {
    var url = 'http://localhost:8088/media/lightplayer/tests/runner.html';

    this.async();

    grunt.utils.spawn( { cmd : 'open', args: [ url ] }, function ( err, result, code ) {
        grunt.log.writeln( 'Opening browser to run the test suite.' );
        
        if ( code ) {
            grunt.warn( 'erro', code );
        }
    });
  });

  grunt.loadNpmTasks('grunt-css')
};
