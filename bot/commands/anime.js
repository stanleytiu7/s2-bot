"use strict";

const request = require('request-promise');
const AnimeList = require('../classes/animeList');


/**
 * Initializes the function so that it can handle validation and rate limiting
 * return function
 */
function init() {

	let queryDelay = false;
	const JIKAN_DELAY = 4000; // ms
	const JIKAN_DELAY_MSG = 'Please wait, currently delayed since last request.';
	return async function (args = []) {
		if (queryDelay) {
			return {
				animeList: [], 
				err: new Error(`${JIKAN_DELAY_MSG}`)
			};
		} else {
			queryDelay = true;
			setTimeout(() => queryDelay = false, JIKAN_DELAY);
			return await handleExternalAPI(args);
		}
	}
}

/**
 * Queries jikan's API for anime
 * returns {animeList, err} 
 * animeList - [anime], see class animeList for shape
 * err - is the error Object if we hit an error 
 */
async function handleExternalAPI (args) {
	let err = null;
	let animeList = [];

	const BASE_API_ROUTE = 'https://api.jikan.moe/v3';
	const SEARCH_ANIME_ROUTE = '/search/anime'
	const options = {
		uri: BASE_API_ROUTE + SEARCH_ANIME_ROUTE,
		qs: {
			q: args.join(' '),
			page: 1
		},
		json: true
	};
	try {
		const res = await request(options);
		animeList = new AnimeList(res.results);
	} catch (e) {
		console.error(e);
		const MIN_LENGTH_ERROR = 'I can\'t search without being given at least 3 characters!';
		err = new Error(MIN_LENGTH_ERROR);
	};
	return {
		animeList,
		err
	};
};



module.exports = init();
