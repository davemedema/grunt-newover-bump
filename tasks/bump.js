var semver = require('semver')

/**
 * Return the prevalent indentation.
 *
 * @param {string} str
 *
 * @return {string}
 */
function getIndentation (str) {
  var spaces = str.match(/^[ ]+/gm) || []
  var tabs = str.match(/^[\t]+/gm) || []

  var prevalent = (tabs.length >= spaces.length) ? tabs : spaces
  var space

  var len = prevalent.length

  for (var i = 0; i < len; i++) {
    if (!space || (prevalent[i].length < space.length)) {
      space = prevalent[i]
    }
  }

  return space
}

/**
 * The Grunt wrapper.
 *
 * @param {object} grunt
 */
module.exports = function (grunt) {
  grunt.registerTask('bump', 'Bump.', function (release, env) {
    var options = this.options({
      configProp: 'pkg',
      file: 'package.json'
    })

    if (env === 'test') {
      options = {
        configProp: '_pkg',
        file: 'tmp/package.json'
      }
    }

    // Validate options.file...
    if (!grunt.file.exists(options.file)) {
      grunt.warn('File "' + options.file + '" not found.')
    }

    // Read and parse options.file...
    var jsonStr = grunt.file.read(options.file)
    var json = JSON.parse(jsonStr)

    // Make sure we're updating a valid semantic version...
    if (!semver.valid(json.version)) {
      grunt.warn('"' + json.version + '" is not a valid semantic version.')
    }

    // Validate release...
    release = (release || 'patch').toLowerCase()

    var releaseTypes = ['major', 'minor', 'patch', 'prerelease']

    if (releaseTypes.indexOf(release) === -1 && !semver.valid(release)) {
      grunt.warn('"' + release + '" is not a valid release type or semantic version.')
    }

    // Update json
    json.version = semver.valid(release) || semver.inc(json.version, release)

    // Write options.file
    var indentation = getIndentation(jsonStr)

    if (!grunt.file.write(options.file, JSON.stringify(json, null, indentation))) {
      grunt.warn('Couldn\'t write "' + options.file + '".')
    }

    // Update config property...
    grunt.config.set(options.configProp, json)

    // Inform...
    grunt.log.ok('Bumped to: v' + json.version)
  })
}
