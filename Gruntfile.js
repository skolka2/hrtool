var glob = require("glob");

module.exports = function(grunt) {
	

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less:{
			develop:{
				options:{
					compress: false,
					yuicompress: false,	
				},
				files:{
					"public/dist/main.css": ["public/css/*.less", "public/js/**/*.less"]
				}
			},
			production: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					"public/dist/main.css": ["public/css/*.less", "public/js/**/*.less"]
				}
			}

		},
		webpack: {
			build:{
				entry: glob.sync("./public/js/**/*.js"),
				output: {
					path:"public/dist/",
					filename:"[name].js",
				},
				loaders: [{ test: /\.jade$/, loader: "jade-loader" }],
				node: {
				  fs: "empty"
				}
			}
		},
		watch:{
			app: {
				files: ["public/**", '!public/dist/**'],
				tasks: ['default']
			}
		}

	});

grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks("grunt-webpack");
grunt.loadNpmTasks ('grunt-contrib-less');

grunt.registerTask("default", ["dev"]);
grunt.registerTask("dev", ["less:develop","webpack"]);
grunt.registerTask("release", ["less:production","webpack"]);

};
