/**
 * The Grunt wrapper.
 *
 * @param {object} grunt
 */
module.exports = function (grunt) {
  grunt.initConfig({

    /**
     * @gconfig pkg
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * @gconfig bump
     */
    // bump: {
      // options: {
        // configProp: 'bumpPkg',
        // file: 'tmp/package.json'
      // }
    // },

    /**
     * @gconfig clean
     */
    clean: {
      test: ['tmp/*']
    },

    /**
     * @gconfig copy
     */
    copy: {
      test: {
        src: ['test/fixtures/package.json'],
        dest: 'tmp/package.json'
      }
    },

    /**
     * @gconfig nodeunit
     */
    nodeunit: {
      prerelease: ['test/prerelease_test.js'],
      patch: ['test/patch_test.js'],
      minor: ['test/minor_test.js'],
      major: ['test/major_test.js'],
      version: ['test/version_test.js']
    }
  })

  // Autoload
  // ---------------------------------------------------------------------------

  require('load-grunt-tasks')(grunt)

  // Load
  // ---------------------------------------------------------------------------

  grunt.loadTasks('tasks')

  // Tasks
  // ---------------------------------------------------------------------------

  /**
   * @gtask grunt
   */
  grunt.registerTask('default', ['test'])

  /**
   * @gtask release
   */
  grunt.registerTask('release', function (type) {
    // grunt.task.run('test')
    grunt.task.run('bump:' + (type || 'patch'))
    grunt.task.run('tag')
  })

  /**
   * @gtask test
   */
  grunt.registerTask('test', [
    'clean:test',
    'copy:test',
    'bump:prerelease',
    'nodeunit:prerelease',
    'bump:patch',
    'nodeunit:patch',
    'bump:minor',
    'nodeunit:minor',
    'bump:major',
    'nodeunit:major',
    'bump:0.1.0',
    'nodeunit:version'
  ])
}
