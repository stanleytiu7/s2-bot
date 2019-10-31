const Discord = require('discord.js');
const winston = require('winston');
const auth = require('./auth.json');

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
	console.log(message);
	// Our bot needs to know if it will execute a command
	// It will listen for messages that will start with `!`
	if (message.content[0] == '!') {
		const cmd = message.content.slice(1);

		switch(cmd) {
			// !ping
			case 'ping':
				message.channel.send('pong')
				break;
				// Just add any case commands if you want to..
		}
	}
});

client.login(auth.token);
