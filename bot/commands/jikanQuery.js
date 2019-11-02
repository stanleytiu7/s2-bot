"use strict";

const request = require('request-promise');
const utils = require('./utils');

const BASE_API_ROUTE = 'https://api.jikan.moe/v3';
const SEARCH_ANIME_ROUTE = '/search/anime';
const SEARCH_USER_ROUTE = '/user';

/**
 * Initializes the function so that it can handle validation and rate limiting
 * return function
 */
function init() {

	let queryDelay = false;
	const JIKAN_DELAY = 4000; // ms
	const JIKAN_MINIMUM_QUERY_LENGTH = 3;
	return async function (args = [], type = 'anime') {
		let err = null;
		let animeList = [];
		err = utils.validateArgsRequired(args) 
			|| utils.validateArgsMinimumLength(args, JIKAN_MINIMUM_QUERY_LENGTH) 
			|| validateQueryDelay(queryDelay);
		if (err) return { animeList, err }
		else {
			queryDelay = true;
			setTimeout(() => queryDelay = false, JIKAN_DELAY);
			if (jikanQuery(args)[type]) {
				return jikanQuery(args)[type]();
			}
			else {
				err = new Error('Invalid jikan query type specified.');
				return {animeList, err};
			}
		}
	}
}

function jikanQuery (args) {
	return {
		'anime': () => {
			const joinedArgs = args.join(' ');
			return queryAnime({ q: joinedArgs, page: 1 });
		},
		'user': () => {
			const user = args[0]; // users can't contain spaces
			return queryUser(`${SEARCH_USER_ROUTE}/${user}/animelist/all`)({ order_by: 'score', sort: 'descending' }); // doesn't require query string.
		}
	}
};


/**
 * Queries jikan's API
 * returns {data, err} 
 * data depends on type of query being used
 * err - is the error Object if we hit an error 
 */
function query(baseApiRoute) {
	return searchRoute => {
		return async (queryStringObject = {}) => {
			let err = null;
			let data = null;
			const options = {
				uri: baseApiRoute + searchRoute,
				qs: queryStringObject,
				json: true
			};
			try {
				data = await request(options);
			} catch (e) {
				console.error(e);
				err = new Error('Error querying Jikan.moe. Please wait a few moments and try again.');
			}
			return {
				data,
				err
			};
		};
	};
}

/**
 * Curried function lacking the query string. Completed by jikanQuery function.
 */
const queryAnime = query(BASE_API_ROUTE)(SEARCH_ANIME_ROUTE);

const queryUser = query(BASE_API_ROUTE);

function validateQueryDelay(queryDelay) {
	let err = null;
	const JIKAN_DELAY_MSG = 'Please wait, currently delayed since last request.';
	if (queryDelay) err = new Error(`${JIKAN_DELAY_MSG}`);
	return err;
}


module.exports = init();
