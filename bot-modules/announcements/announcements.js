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

	module.save = async(msg) => {
		let message = msg.content;

		msg.mentions.users.forEach(user => {
			let re = new RegExp("<@" + user.id + ">", "g");
			message = message.replace(re, user.username);
		});

		msg.mentions.roles.forEach(role => {
			let re = new RegExp("<@&" + role.id + ">");
			message = message.replace(re, role.name);
		});

		msg.mentions.channels.forEach(channel => {
			let re = new RegExp("<#" + channel.id + ">");
			message = message.replace(re, channel.name);
		});

		const splitMessage = message.split('\n', 1);

		const title = splitMessage[0];
		const body = message.substr(title.length + 1);
		const date = moment(msg.createdAt).format('MM/DD/YYYY');
		const author = msg.author.username;

		if (!body) {
			body = title;
			title = "";
		}

		const insertQuery = 'INSERT INTO fissure.announcements (title, date, body, author) VALUES (' + mysql.escape(title) + ', ' + mysql.escape(date) + ', ' + mysql.escape(body) + ', ' + mysql.escape(author) + ')';

		connection.query(insertQuery, err => {
			if (err) {
				return msg.author.send("An error occured while writing the message into the db: ```" + JSON.stringify(err) + "```").catch(() => {});
			}
		});
	}

	return module;
}