const Discord = require('discord.js');
const winston = require('winston');
const auth = require('../auth.json');
const AnimeList = require('./classes/animeList');

const Store = require('./classes/store.js');
const store = new Store();

/**
 * command related logic in their own files, all message sending logic exists here... (for now)
 */
const {
	jikanQuery,
	animeInfo
} = require('./commands');

/**
 * COMMANDS
 * keep in config object to allow for easy help command
 */
const commands = {
	'ping': (message, args) => {
		message.channel.send('pong')
	},
	'anime': (message, args) => {
		message.channel.send(`Querying for your search: \"${args.join(' ')}\", ${message.author}`);
		jikanQuery(args, 'anime').then(res => {
			const {data, err} = res;
			if (err) message.channel.send(err.message);
			else {
				const animeListInstance = new AnimeList(data.results)
				store.setAnimeList(animeListInstance);
				message.channel.send(animeListInstance.getDisplayList(5));
			}
		});
	},
	'anime-info': (message, args) => {
		// TODO: rewrite for cleaner code
		const animeList = store.getAnimeList();
		const { animeInfoMsg, err } = animeInfo(animeList, args);
		if (err) message.channel.send(err.message);
		else message.channel.send(animeInfoMsg);
		
	},
	'test-MAL-user': (message, args) => {
		message.channel.send(`Querying for user: \"${args[0]}\", ${message.author}`);
		jikanQuery(args, 'user').then(res => {
			const { data, err } = res;
			if (err) message.channel.send(err.message);
			else {
				const userAnimeList = data.anime;
				const animeListInstance = new AnimeList(userAnimeList);
				message.channel.send(animeListInstance.getDisplayList(30));
			}
		})
		
	},
	'register-MAL': (message, args) => {
	}
}

const allCommands = Object.keys(commands).sort();

/**
 * !help
 */
commands['help'] = (message, args) => {
	message.channel.send(allCommands);
}

/**
 * Logger instantiation
 */
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 's2-bot-service'},
	transports: [
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' })
	]
});

/** Configure logger settings
 * logger.remove(logger.transports.Console);
 */ colorize: true
logger.add(new winston.transports.Console({
	format: winston.format.simple()
}));

logger.level = 'debug';

/**
 * Init the Discord Client to dig into methods + events
 */
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

		// console.log('action:', action);
		// console.log('args:', args);
		// console.log('cmd:', cmd);

		if (commands[action]) {
			commands[action](message, args);
		} else {
			message.channel.send(`I don\'t understand ${action}.`);
		}
	}
});

client.login(auth.token);
