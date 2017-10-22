'use strict';

// require modules
const checksolution = require('csproj-integrity');
const log = console.log;
const chalk = require('chalk');

module.exports = function(grunt) {
	return grunt.registerMultiTask('integrity_checker', 'Analyze CSPROJ file and included files.', function() {
		var _this = this,
			out = "",
			checkFilesResult = false,
			done = _this.async();

		log('\n=========================================================================\n');

		Promise
			.resolve()
			.then(function() {
				return checksolution.checkFiles(_this.data.filesList);
			})
			.then(function(result) {

				checkFilesResult = JSON.parse(result);

				return checksolution.checkIntegrity();
			})
			.then((result) => {
				var ret = JSON.parse(result);

				if (checkFilesResult.status != 'success') {

					out = "\n";
					out += "\n "
					out += checkFilesResult.message
					out += "\n"
					out += "\n"
					checkFilesResult.data.forEach(function(file) {
						out += " - " + file + "\n";
					});

					log(chalk.white.bgRed.bold(out));

				} else {
					log(chalk.white.bgGreen.bold(checkFilesResult.message));
				}

				log('\n=========================================================================\n');

				if (ret.status != 'success') {
					log(chalk.white.bgRed.bold(ret.message));
					log('\n');

					if (ret.data.fileNotFound && ret.data.fileNotFound.length) {
						log(chalk.white.bgBlue.bold('= NOT FOUND ==================================='));
						log('\n');
						ret.data.fileNotFound.forEach(function(file) {
							log(chalk.white.bgRed.bold(file));
						})
						log('\n');
					}

					if (ret.data.duplicatedFiles && ret.data.duplicatedFiles.length) {
						log(chalk.white.bgBlue.bold('= DUPLICATED ==================================='));
						log('\n');
						ret.data.duplicatedFiles.forEach(function(file) {
							log(chalk.white.bgRed.bold(file));
						})
						log('\n');
					}

				} else {
					log(chalk.white.bgGreen.bold(ret.message));
				}

				log('\n=========================================================================\n');

				if (ret.data.none && ret.data.none.length) {
					out = "\n";
					out += "\n"
					out += " = TYPE NONE ==================================="
					out += "\n"
					out += "\n"
					ret.data.none.forEach(function(file) {
						out += " - " + file + "\n";
					})

					log(chalk.white.bgBlue.bold(out));
				}

				// log('\n=========================================================================\n');

				// if (ret.data.content && ret.data.content.length) {
				//   out = "\n";
				// 	out += "\n"
				// 	out += " = TYPE CONTENT ==================================="
				// 	out += "\n"
				// 	out += "\n"
				// 	ret.data.content.forEach(function(file) {
				// 		out += " - " + file + "\n";
				// 	})
				// 
				// 	log(chalk.white.bgBlue.bold(out));
				// }

			}).catch((err) => {
				done();
			});
	});
};