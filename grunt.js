
module.exports = function(grunt) {
    var path = 'lightplayer/media/lightplayer';

    grunt.initConfig({
      concat: {
        dist: {
          src: [path+'/src-*.js'],
          dest: path+'/src.js'
        }
      },

      lint: {
        files: [path+'/src-*.js']
      },

      min: {
        dist: {
          src: [path+'/src-*.js'],
          dest: path+'/min.js'
        }
      }
    });
};
