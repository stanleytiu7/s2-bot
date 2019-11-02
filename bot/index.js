const Discord = require('discord.js');
const winston = require('winston');
const auth = require('../auth.json');

const Store = require('./classes/store.js');
const store = new Store();

const MIN_SEARCH_LENGTH_MSG = 'I can\'t search without being given at least 3 characters!';
const MISSING_ARGS_ERROR_MSG = 'Please give me at least one argument!';

// commands
const {
	anime
} = require('./commands');

const commands = {
	'ping': (message, args) => {
		message.channel.send('pong')
	},
	'anime': (message, args) => {
		if (!args || !args[0]) message.channel.send(MISSING_ARGS_ERROR_MSG);
		else if (args.join(' ').length < 3) message.channel.send(MIN_SEARCH_LENGTH_MSG);
		else {
			message.channel.send(`Querying for your search: \'${args.join(' ')}\', ${message.author}`);
			anime(args).then(res => {
				const {animeList, err} = res;
				if (err) message.channel.send(err.message);
				else {
					store.setAnimeList(animeList);
					message.channel.send(animeList.getDiscordList());
				}
			});
		}
	},
	'anime-info': (message, args) => {
		// TODO: rewrite for cleaner code
		const animeList = store.getAnimeList();
		if (animeList) {
			const {anime, err} = animeList.getAnimeByIndex(args);
			if (err) message.channel.send(err.message);
			else {
				const animeInfo = [];
				animeInfo.push(`Title: ${anime.title}`);
				animeInfo.push(`Score: ${anime.score}`);
				animeInfo.push(`Synopsis: ${anime.synopsis}`);
				animeInfo.push(`# of Episodes: ${anime.episodes}`);
				animeInfo.push(`link: ${anime.url}`);
				message.channel.send(animeInfo);
			}
		} else {
			message.channel.send('No Anime List Found. Try !anime \'Search Term\'.');
		}
	},
	'register-MAL': (message, args) => {
	}
}

const allCommands = Object.keys(commands);

commands['help'] = (message, args) => {
	message.channel.send(allCommands);
}

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 's2-bot-service'},
	transports: [
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' })
	]
});

// Configure logger settings
// logger.remove(logger.transports.Console);
// colorize: true
logger.add(new winston.transports.Console({
	format: winston.format.simple()
}));

logger.level = 'debug';
// Initialize Discord Bot
const client = new Discord.Client();

client.on('ready', function (evt) {
	logger.info('Connected');
	logger.info(`Logged in as: ${client.user.tag}`);
});

client.on('message', message => {
	// Our bot needs to know if it will execute a command
	// It will listen for messages that will start with `!`
	if (message.content[0] == '!') {
		const cmd = message.content.slice(1);
		const split = cmd.split(' ');
		const [action, ...args] = split;
		console.log('action:', action);
		console.log('args:', args);
		console.log('cmd:', cmd);

		if (commands[action]) {
			commands[action](message, args);
		} else {
			message.channel.send(`I don\'t understand ${action}.`);
		}
	}
});

client.login(auth.token);
