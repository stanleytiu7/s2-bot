"use strict";

/**
 * returns an error. If err = null, no error was found.
 */
function validateArgsRequired(args) {
	let err = null;
	if (!args || !args[0]) err = new Error('Please give me at least one argument!');
	return err;
}

function validateArgsMinimumLength(args, length) {
	let err = null;
	if (args.join(' ').length < length) err = new Error(`Arguments need to be > ${length} characters!`);
	return err;
}

function validateArgsMaximumLength(args, length) {
	let err = null;
	if (args.join(' ').length <= length) err = new Error(`Arguments need to be < ${length} characters!`);
}

module.exports = {
	validateArgsRequired,
	validateArgsMinimumLength
}
