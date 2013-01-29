
module.exports = function ( grunt ) {

  grunt.initConfig({
    concat: {
      dist: {
        src: ['js/*.js'],
        dest: 'build/src.js'
      },

      css: {
        src: ['css/*.css'],
        dest: 'build/src.css'
      }
    },

    lint: {
      files: ['js/*.js']
    },

    csslint: {
      dist: {
        src: 'css/*.css',
        rules: {
          "import": false,
          "overqualified-elements": false,
          "star-property-hack": false,
          "box-model": false,
          "adjoining-classes": false
        }
      }
    },

    min: {
      dist: {
        src: ['build/src.js'],
        dest: 'build/min.js'
      }
    },

    cssmin: {
      dist: {
        src: ['build/src.css'],
        dest: 'build/min.css'
      }
    },
    
    imagescopy: {
      src: 'imgs',
      dest: 'build'
    }
  });

  grunt.loadNpmTasks('grunt-css');

  /* Aliased just for readability purposes on "build" task */
  grunt.registerTask('jsmin', 'min');
  grunt.registerTask('jslint', 'lint');
  grunt.registerTask('build', 'testem jslint concat jsmin cssmin imagescopy');

  grunt.registerTask('imagescopy', 'Copy images to the build/', function () {
      var done = this.async(),
          src = grunt.config('imagescopy.src'),
          dest = grunt.config('imagescopy.dest');

      grunt.utils.spawn( { cmd: 'cp', args: ['-R', src, dest] }, function ( err, result, code ) {
          if ( result.stderr ) {
              grunt.log.writeln( '\n'+result.stderr+'\n' );
          } else {
              grunt.log.writeln( 'Image files copied on "'+dest+'/".' );
          }
          
          done( code>0? false: true );
      } );
  } );
};
