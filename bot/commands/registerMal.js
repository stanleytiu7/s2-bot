"use strict";

const fs = require('fs');
const utils = require('./utils');

registerMal(message, args) {
	let err = null;
	let success = null;
	err = utils.validateArgsRequired(args)
	|| utils.validateArgsMinimumLength(args, 2)
	|| utils.validateArgsMaximumLength(args, 16)
	if (err) return { success, err }
	else {
		// do something here
	}


	const author = message.author;
	const myAnimeListUser = args[0];
}

module.exports = registerMal;
