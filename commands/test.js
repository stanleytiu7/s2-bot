const request = require('request-promise');

let err = null;
let anime = [];
const BASE_API_ROUTE = 'https://api.jikan.moe/v3';
const SEARCH_ANIME_ROUTE = '/search/anime'
const options = {
	uri: BASE_API_ROUTE + SEARCH_ANIME_ROUTE + '?q=Naruto&page=1',
	json: true
};

async function hello() {
	try {
		anime = await request(options);
		console.log(anime);
	} catch (e) {
		err = new Error(e);
	};
	const something =  {
		anime,
		err
	};
	console.log(something);
}


hello();

