/**
 * Echo Bot: A discord bot for Echo League
 * Made with love and care so that we can properly schedule things in Echo League
 * @version 0.3.1
 * @author Alex Muench, Jon Jazdzewski, Thomas Kosiewski
 */

//Require needs deps and auth file
var Discord = require('discord.js');
var package = require('./package.json');
var AuthDetails = require('./auth.json');
var core = require('./bot-core/core/core.js');
var api = require('./bot-core/appscript-api/appscript-api.js');
var moment = require('moment');
moment().format();
var mysql = require('mysql');
var config = require('./config.json')

const connection = mysql.createConnection({
	host: config.mysql_host,
	port: config.mysql_port,
	user: config.mysql_user,
	password: config.mysql_pwd,
	database: config.mysql_db
});

//Define symbol used to designate bot commands
var commandPredecessor = "!";

//Create bot 
var bot = new Discord.Client();

//Call all modules and plugins
var chatTools = require('./bot-modules/chat-tools/chat-tools.js')(bot, core);
var faq = require('./bot-modules/faq/faq.js')(bot, core);
var player = require('./bot-modules/fetch/fetch.js')(bot, core);
var ads = require('./bot-modules/ads/ads.js')(bot, core);
var twitch = require('./bot-modules/twitch/twitch.js')(bot, core);
var allstars = require('./bot-modules/allstars/allstars.js')(bot, core);
var announcements = require(__dirname + '/bot-modules/announcements/announcements.js')(bot, core);
let link = require('./bot-modules/link/link.js')(bot, core);
var mutes = require(__dirname + '/bot-modules/mutes/mutes.js')(bot, core);

//Login with auth.json
bot.login(AuthDetails.token);

//The last message that caused bot to send "Bark bark. Woof woof."
var lastMsg = ".echoee.";

//Bot ready code
bot.on('ready', function () {
	console.log('====================');
	console.log('Echo Bot v' + package.version);
	console.log('Now logged in!! \n\nServing in some channels');
	console.log('====================');
	var rand = Math.random();
	if (rand > 0.5) {
		ads.runPVG();
	} else {
		ads.runFYM();
	}
	//432000000 5 days in mSec
	//18000000 5 hours in mSec
	//600000 10 minutes in mSec
});

//Bot disconnect code
bot.on('disconnected', function () {
	console.log('Disconnected!');
	//exit node.js
	process.exit(1);
});
//Bot logic to run whenever a message is received
bot.on('message', function (msg) {
	var EL = bot.guilds.get('261386843923283970')
	var adminRole = EL.roles.get('261707169353826314')
	var adminUser = adminRole.members.get(msg.author.id)

	if (specialChannel(msg, EL) || (mutes.muted(msg) && !adminUser)) {
		return;
	} else if (msg.author.id == '326760828198060032') {
		let casterID = msg.content;
		EL.fetchMember(casterID).then(member => {
			member.addRole('269272020884258816');
		}).catch(err => console.error(err));
	} else if (msg.author.name !== 'EchoBot' && msg.author.name !== 'StatsBot' && !msg.author.bot) {
		var formattedDate = moment(new Date()).format("DD/MM/YYYY hh:mmA")
		var channelName = msg.channel.name ? msg.channel.name : msg.author.name;
		//logs message out to node console so we can see history in dev console
		console.log('(' + formattedDate + ' CST) Message from channel ' + channelName +
			"\n====> " + msg.author.username + ": " + msg.content + '\n');
		parseCommand(msg);
	}
	/*if (msg.author.id==='125813798341705728'){
		var log = bot.users.get(msg.content);
		console.log(log);
	}*/
	


});

bot.on('messageUpdate', (oldMsg, msg) => {
	let EL = bot.guilds.get('261386843923283970');
	let formattedDate = moment(new Date()).format("DD/MM/YYYY hh:mmA");
	var channelName = msg.channel.name ? msg.channel.name : msg.author.name;
	console.log('(' + formattedDate + ' CST) Message updated in channel ' + channelName + "\n====> " + msg.author.username + ":\n(old message): " + oldMsg.content + '\n(new message): ' + msg.content);

	if (!specialChannel(msg, EL))
		mutes.muted(msg);
});

function specialChannel(msg, EL) {
	if (msg.channel.id === "299204919213162496") {
		msg.delete();
		return false;
		// ONLY FOR TESTING:
		// } else if (msg.channel.id === "267882347171414019") {
	} else if (msg.channel.id === "261715473002004480") {
		if (msg.content.startsWith("!")) {
			return true;
		} else {
			announcements.save(msg);
			return false;
		}
	}
};

function parseCommand(msg) {
	var message = msg.content;
	//check if user is a verified caster
	var EL = bot.guilds.get('261386843923283970')
	var casterRole = EL.roles.get('269272020884258816')
	var caster = casterRole.members.get(msg.author.id)
	var adminRole = EL.roles.get('261707169353826314')
	var adminUser = adminRole.members.get(msg.author.id)
	//checks to see if there is a command issued with the command predecessor
	if (message.indexOf(commandPredecessor) === 0) {
		//converts message to lowercase for easier matching
		command = message.split(" ")[0].toLowerCase().substr(1);
		//switch statement for matching commands
		switch (command) {
			case "help":
				chatTools.showHelp(msg.channel, msg.author);
				break;
			case "allstar":
			case "allstars":
				allstars.castVote(msg);
				break;
			case "allstars_votes":
				if (adminUser)
					allstars.getVotes(msg);
				break;
			case "update":
				if (caster || adminUser) {
					twitch.search();
				} else {
					chatTools.showInvalidCommand(msg.channel);
				}
				break;
			case "link":
				link.check(message, msg.author, msg.channel);
				break;
			case "linkrefresh":
				if (adminUser) {
					link.update();
				}
				break;
			default:
				chatTools.showInvalidCommand(msg.channel);
		}
	} else {
		parseQuestion(msg);
	}
};

function parseQuestion(msg) {
	var message = msg.content.toLowerCase();
	if (msg.author.id !== '262072502237397013' && msg.author.id !== '263123146415144960' && msg.author.id !== "284058388768358411" && msg.content.length < 50) {
		if ((message.indexOf('registration') !== -1 || message.indexOf('league') !== -1) && (message.indexOf('start') !== -1 || message.indexOf('begin') !== -1) && (message.indexOf('when') !== -1 || message.indexOf('what') !== -1)) {
			faq.RegStart(msg.channel, msg.author);
		} else if (message.indexOf('registration') !== -1 && (message.indexOf('end') !== -1 || message.indexOf('finish') !== -1 || message.indexOf('finished') !== -1) && (message.indexOf('when') !== -1 || message.indexOf('what') !== -1)) {
			faq.RegEnd(msg.channel, msg.author);
		} else if ((message.indexOf('what') !== -1 || message.indexOf('which') !== -1) && (message.indexOf('tier') !== -1 || message.indexOf('division') !== -1 || message.indexOf('league') !== -1) && message.indexOf('team') !== -1) {
			faq.TeamCalc(msg.channel, msg.author);
		} else if ((message.indexOf('how') !== -1 || message.indexOf('what') === 0 || message.indexOf('is there') !== -1 || message.indexOf('can ') !== -1) && (message.indexOf('add') !== -1 || message.indexOf('remove') !== -1 || message.indexOf('form') !== -1 || message.indexOf('create') !== -1 || message.indexOf('register') !== -1 || message.indexOf('swap') !== -1 || message.indexOf('drop') !== -1 || message.indexOf('made') !== -1) && (message.indexOf('team') !== -1 || message.indexOf('player') !== -1)) {
			faq.TeamForm(msg.channel, msg.author);
		} else if (msg.author.id === "81879907566628864" && message.indexOf('echo ') !== -1) {
			faq.echoBark(msg.channel, msg.author);
			lastMsg = message;
		} else if ((message.indexOf('admin') !== -1 || message.indexOf('staff') !== -1) && message.indexOf('any') !== -1 && (message.indexOf('here') !== -1 || message.indexOf('available') !== -1 || message.indexOf('around') !== -1 || message.indexOf('awake') !== -1)) {
			faq.adminHere(msg.channel, msg.author);
		} else if ((message.indexOf('team') !== -1 || message.indexOf('leader') !== -1 || message.indexOf('organizer') !== -1 || message.indexOf('cap') !== -1) && (message.indexOf('not responding') !== -1 || message.indexOf('unresponsive') !== -1 || message.indexOf("won't respond") !== -1 || message.indexOf("won't schedule") !== -1 || message.indexOf("won't talk") !== -1 || message.indexOf("won't message") !== -1 || message.indexOf("doesn't respond") !== -1 || message.indexOf("doesn't message") !== -1 || message.indexOf("doesn't schedule") !== -1 || message.indexOf("isn't messaging") !== -1 || (message.indexOf("can't") !== -1 && message.indexOf('respond to') !== -1)) && (message.indexOf('my team') === -1 || message.indexOf('my cap') === -1)) {
			faq.noResponse(msg.channel, msg.author);
		} else if ((message.indexOf('who') !== -1 || message.indexOf('what') !== -1 || message.indexOf('how') !== -1 || message.indexOf('where') !== -1) && (message.indexOf('standin') !== -1 || message.indexOf('stand in') !== -1 || message.indexOf('stand-in') !== -1) && (message.indexOf('approve') !== -1)) {
			faq.standins(msg.channel, msg.author);
		} else if ((message.indexOf('what') !== -1 || message.indexOf('how') !== -1 || message.indexOf('who') !== -1) && message.indexOf('late') !== -1 && (message.indexOf('penalties') !== -1 || message.indexOf('rules') !== -1 || message.indexOf('punish') !== -1)) {
			faq.lateRules(msg.channel, msg.author);
		} else if ((message.indexOf('what') !== -1 || message.indexOf('who') !== -1 || message.indexOf('is there') !== -1) && (message.indexOf('mmr') !== -1) && (message.indexOf('cap') !== -1) && (message.indexOf('5000') === -1) && (message.indexOf('5k') === -1)) {
			faq.MMRCap(msg.channel, msg.author);
		} else if ((message.indexOf('what') !== -1) && (message.indexOf('division') !== -1 || message.indexOf('tier') !== -1) && (message.indexOf('are') !== -1) && message.indexOf('you') === -1 && msg.author.id !== '183383997328523264') {
			faq.divQuestion(msg.channel, msg.author);
		} else if ((message.indexOf('what') !== -1 || message.indexOf('how') !== -1 || message.indexOf('where') !== -1 || message.indexOf('who') !== -1 || message.indexOf('someone') !== -1 || message.indexOf('anyone') !== -1) && (message.indexOf('point') !== -1 | message.indexOf('ranking') !== -1) && (message.indexOf('system') !== -1 || message.indexOf('league points') !== -1)) {
			faq.pointQuestion(msg.channel, msg.author);
		} else if (message.indexOf('pvgna') !== -1 || message.indexOf('gameleap') !== -1 || message.indexOf('game-leap') !== -1) {
			ads.runPVG();
		} else if (message.indexOf('echo') !== -1 && message.indexOf('speak') !== -1) {
			faq.dogShell(msg.channel, msg.author);
		} else if (message.indexOf('echo') !== -1 && message.indexOf('uptime') !== -1) {
			msg.channel.send(bot.uptime);
		} else if (message === lastMsg) {
			faq.dogShell(msg.channel, msg.author)
		}

	} else { }
};
