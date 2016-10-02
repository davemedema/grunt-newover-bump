var grunt = require('grunt')

exports.version_test = {

  setUp: function (done) {
    done()
  },

  works: function (test) {
    var expected = '0.1.0'

    var json = grunt.file.readJSON('tmp/package.json')
    var pkg = grunt.config('_pkg')

    test.expect(2)
    test.equal(json.version, expected, 'Should be equal.')
    test.equal(pkg.version, expected, 'Should be equal.')
    test.done()
  }
}
