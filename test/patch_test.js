var grunt = require('grunt')

exports.patch_test = {

  setUp: function (done) {
    done()
  },

  works: function (test) {
    var expected = '0.1.1'

    var json = grunt.file.readJSON('tmp/package.json')
    var pkg = grunt.config('bumpPkg')

    test.expect(2)
    test.equal(json.version, expected, 'Should be equal.')
    test.equal(pkg.version, expected, 'Should be equal.')
    test.done()
  }
}
