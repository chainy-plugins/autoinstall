"use strict";
module.exports = function(chainy){
	chainy.mixin('requirePlugin', function(pluginName){
		// Prepare
		var plugin = null
		var pluginPackageName = 'chainy-plugin-'+pluginName
		var spawnSync = null
		var fail = true
		var spawnResult = null
		var packagePath = null

		// Require our plugin package
		try {
			plugin = require(pluginPackageName)
			fail = false
		}
		catch (err) {
			// Package path
			packagePath = process.cwd()+'/package.json'

			// Check if we are not in the browser, check that spawnSync exists, check that the project's package.json exists
			if ( process.browser !== true &&
				(spawnSync = require('child_process').spawnSync) &&
				(require('fs').existsSync(packagePath) === true)
			) {
				console.log('Attempting to automatically install the missing plugin: '+pluginName)
				spawnResult = spawnSync('npm', ['install', '--save', pluginPackageName], {cwd: process.cwd()});
				if ( !spawnResult.error ) {
					// Attempt install again
					try {
						plugin = require(process.cwd()+'/node_modules/'+pluginPackageName)
						console.log('Automatic install successful')
						fail = false
					} catch (err) {}
				}
			}
		}

		if ( !plugin || fail === true ) {
			throw chainy.getRequirePluginError(pluginName)
		}

		// Return the required package
		return plugin
	})
}
module.exports.extensionType = 'custom'