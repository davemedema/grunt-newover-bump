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
  grunt.registerTask('bump', 'Bump.', function (release) {
    var opts = this.options({
      configProp: 'pkg',
      file: 'package.json'
    })

    // Validate opts.file...
    if (!grunt.file.exists(opts.file)) {
      grunt.warn('File "' + opts.file + '" not found.')
    }

    // Read and parse opts.file...
    var jsonStr = grunt.file.read(opts.file)
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

    // Write opts.file
    var indentation = getIndentation(jsonStr)

    if (!grunt.file.write(opts.file, JSON.stringify(json, null, indentation))) {
      grunt.warn('Couldn\'t write "' + opts.file + '".')
    }

    // Update config property...
    grunt.config.set(opts.configProp, json)

    // Inform...
    grunt.log.ok('Bumped to: ' + json.version)
  })
}
