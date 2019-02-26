module.exports = function (bot, core) {
	var module = {}
	const mysql = require('mysql');
	const moment = require('moment');
	const config = require(__dirname + '/../../config.json');
	const connection = mysql.createConnection({
		host: config.mysql_host,
		port: config.mysql_port,
		user: config.mysql_user,
		password: config.mysql_pwd,
		database: config.mysql_db
	});

	module.muted = msg => {
		let res = false;

		let EL = bot.guilds.get('261386843923283970');

		let botMutedRole = EL.roles.get('301742078528978944');
		let botMuted = botMutedRole.members.get(msg.author.id);

		let linkMutedRole = EL.roles.get('271459263052906517');
		let linkMuted = linkMutedRole.members.get(msg.author.id);

		if (botMuted) {
			res = true;
		}

		if (linkMuted) {
			let urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
			if (urlPattern.test(msg.content)) {
				msg.delete();
				res = true;
			}
		}

		return res;
	}

	return module;
}