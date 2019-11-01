"use strict";

class AnimeList {
	constructor(animeList) {
		this.list = animeList;
	}

	getDiscordList() {
		const fullDisplayList = this.list.map((anime, idx) => `${idx}. ${anime.title}`);
		return fullDisplayList.slice(0, 20);
	}

	getAnimeByIndex(args) {
		const idx = args[0];
		let anime = {};
		let err = null;
		if (this.list && this.list.length && this.list[idx]) {
			anime = this.list[idx];
		} else {
			err = new Error('I couldn\'t find anime for that number');
		}
		return {anime, err};
	}
}

module.exports = AnimeList;

/**
 * animeList = [anime]
 * anime = {
 *      mal_id: 20,
 *      url: 'https://myanimelist.net/anime/20/Naruto',
 *      image_url: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg?s=59241469eb470604a792add6fbe7cce6',
 *      title: 'Naruto',
 *      airing: false,
 *      synopsis: "Moments prior to Naruto Uzumaki's birth, a huge demon known as the Kyuubi, the Nine-Tailed Fox, attacked Konohagakure, the Hidden Leaf Village, and wreaked havoc. In order to put an end to the Kyuubi'...",
 *      type: 'TV',
 *      episodes: 220,
 *      score: 7.92,
 *      start_date: '2002-10-03T00:00:00+00:00',
 *      end_date: '2007-02-08T00:00:00+00:00',
 *      members: 1239019,
 *      rated: 'PG-13'
 *    },
 */
