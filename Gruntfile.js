var glob = require("glob");

module.exports = function(grunt) {
	

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	webpack: {
		build:{
			entry:  glob.sync("./public/js/**/*.js"),

			output: {
				path:"public/",
				filename:"[name].js",


			}
		}
	},
	watch:{
		app: {
			files: ["public/**", '!public/main.js'],
			tasks: ['default']
		}
	}

});
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("grunt-webpack");

	grunt.registerTask("default", ["webpack"]);
	grunt.registerTask("dev", ["webpack"]);

};
