const Discord = require('discord.js');
const winston = require('winston');
const auth = require('./auth.json');

const Store = require('./classes/store.js');
const store = new Store();

const MIN_SEARCH_LENGTH_MSG = 'I can\'t search without being given at least 3 characters!';

// commands
const {
	queryAnime
} = require('./commands');

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


		switch(action) {
			case 'ping':
				message.channel.send('pong')
				break;
			case 'anime':
				console.log(args);
				if (!args || !args[0] || args[0].length < 3) {
					message.channel.send(MIN_SEARCH_LENGTH_MSG);
				} else {
					message.channel.send(`Querying for your search: \'${args.join(' ')}\', ${message.author}`);
					queryAnime(message, args).then(res => {
						const {animeList, err} = res;
						if (err) message.channel.send(err.message);
						else {
							store.setAnimeList(animeList);
							message.channel.send(animeList.getDiscordList());
						}
					});
				}
				break;
			case 'anime-info':
				// TODO: rewrite for cleaner code
				const animeList = store.getAnimeList();
				if (animeList) {
					const {anime, err} = animeList.getAnimeByIndex(args);
					if (err) message.channel.send('Could not find anime');
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
				break;
			case 'help':
				message.channel.send('I need to implement this.');
				break;
			default:
				message.channel.send(`I don\'t understand ${action}.`);
		}
	}
});

client.login(auth.token);
