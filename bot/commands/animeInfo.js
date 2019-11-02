"use strict";

function animeInfo(animeList, args) {
	let err = null;
	let animeInfoMsg = null;
	if (animeList) {
		const {anime, err} = animeList.getAnimeByIndex(args);
		if (err) return { animeInfoMsg, err };
		else {
			animeInfoMsg = [];
			animeInfoMsg.push(`Title: ${anime.title}`);
			animeInfoMsg.push(`Score: ${anime.score}`);
			animeInfoMsg.push(`Synopsis: ${anime.synopsis}`);
			animeInfoMsg.push(`# of Episodes: ${anime.episodes}`);
			animeInfoMsg.push(`${anime.url}`);
		}
	} else {
		err = new Error('No Anime list Found. Try !anime \'Search Term\'.');
	}
	return { animeInfoMsg, err }
}

module.exports = animeInfo;
