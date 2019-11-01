"use strict";

class InternalMemoryStore {
	constructor() {
		this.store = {};
	}

	setAnimeList(animeList) {
		this.store.animeList = animeList;
	}

	getAnimeList(animeList) {
		return this.store.animeList;
	}

}


module.exports = InternalMemoryStore;
