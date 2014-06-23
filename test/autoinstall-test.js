"use strict";
(function(){
	// Import
	var expect = require('chai').expect,
		joe = require('joe')

	// Test
	joe.describe('autoinstall plugin', function(describe,it){
		var Chainy = require('chainy-core').subclass().addExtension('autoinstall', require('../'))

		it('cleanup', function(next){
			require('rimraf')(__dirname+'../node_modules/chainy-plugin-set', next)
		})
		
		it("should fire successfully", function(next){
			try {
				var chain = Chainy.create().require('set')
					.set([1,2,3])
					.done(function(err, result){
						if (err)  return next(err)
						expect(result).to.deep.equal([1,2,3])
						return next()
					})
			} catch ( err ) {
				if ( require('semver').satisfies(process.version, '>=0.11') === false ) {
					console.log('error expected as we are on node <0.11')
					next()
				} else {
					next(err)
				}
			}
		})
	})
})()
