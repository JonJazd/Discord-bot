module.exports = function (bot, core) {
	var module = {}
	var mysql = require('mysql');
	var fs = require('fs');
	var config = require('../../config.json');
	const connection = mysql.createConnection({
		host: config.mysql_host,
		port: config.mysql_port,
		user: config.mysql_user,
		password: config.mysql_pwd,
		database: config.mysql_db
	});
	//var general = bot.channels.get('265402026219929601');
	/* 
		265402026219929601 Id for general 
		267882347171414019 ID for test
		299204919213162496 ID for voting_booth
	*/

	let helpText = "In order to cast your vote for the EchoLeague season 1 all stars match, please send a message **mentioning** max 5 player to the <#299204919213162496> channel.\n\nExample: ```!allstars @Player1 @Player2 @Player3 @Player4 @Player5```\nIf you should encourage any issues or trouble casting your vote, don't hesitate posting to <#263852760275877888> or contacting <@163647936046039040>";

	module.castVote = (msg) => {
		if (msg.channel.id !== "299204919213162496") {
			return msg.author.sendMessage("Please send your message into the <#299204919213162496> channel.").catch(() => {});
		}

		let nomUser = msg.mentions.users.filter(u => !u.bot).array().slice(0, 5)

		if (!nomUser.length) {
			// TODO: Check if user already casted vote, if so display last cast
			connection.query('SELECT all_stars.vote FROM fissure.all_stars WHERE discordID=?', [msg.author.id], (err, rows) => {
				if (err) {
					return msg.author.send("An error occured, please forward the following message to <@163647936046039040> ```" + JSON.stringify(err) + "```").catch(() => {});
				}

				if (rows.length > 0) {
					var parsedVotes = []

					try {
						parsedVotes = JSON.parse(rows[0].vote)
					} catch (e) {
						return msg.author.sendMessage(helpText).catch(() => {})
					}

					var res = "Your previous votes for the allstars match ```"
					parsedVotes.forEach(user => {
						res += user.username ? user.username + ", " : user + ", "
					});
					if (res.substr(res.length - 2, res.length) === ", ")
						res = res.substr(0, res.length - 2)
					res += " ```"

					msg.author.sendMessage(res).catch(() => {});
				} else {
					msg.author.sendMessage(helpText).catch(() => {});
				}
			});
		} else {
			connection.query('SELECT all_stars.vote FROM fissure.all_stars WHERE discordID=?', [msg.author.id], (err, rows) => {
				if (err) {
					return msg.author.send("An error occured, please forward the following message to <@163647936046039040> ```" + JSON.stringify(err) + "```").catch(() => {});
				}

				var player = [];

				nomUser.forEach(user => {
					player.push({
						id: user.id,
						username: user.username.replace(/[\u{10000}-\u{10ffff}]/gu, '')
					})
				})

				// UPDATE
				if (rows.length > 0) {
					// UPDATE fissure_test.all_stars SET vote = '["Greyhound"]' WHERE discordID=163647936046039040
					let updateQuery = 'UPDATE fissure.all_stars SET vote = ' + mysql.escape(JSON.stringify(player)) + ' WHERE discordID=' + mysql.escape(msg.author.id);

					connection.query(updateQuery, (err, rows) => {
						if (err) {
							return msg.author.send("An error occured, please forward the following message to <@163647936046039040> ```" + JSON.stringify(err) + "```").catch(() => {});
						}

						var res = "Successfully updated your votes for ```"
						nomUser.forEach(user => {
							res += user.username + ", "
						});
						if (res.substr(res.length - 2, res.length) === ", ")
							res = res.substr(0, res.length - 2)
						res += " ```\nSee you at the allstars match."
						// send response
						msg.author.sendMessage(res).catch(() => {});
					});
				}
				// INSERT
				else {
					// INSERT INTO fissure_test.all_stars (discordID, vote) VALUES ("163647936046039040", "['a', 'b', 'c']")
					let insertQuery = 'INSERT INTO fissure.all_stars (discordID, vote) VALUES (' + mysql.escape(msg.author.id) + ', ' + mysql.escape(JSON.stringify(player)) + ')';

					connection.query(insertQuery, (err, rows) => {
						if (err) {
							return msg.author.send("An error occured, please forward the following message to <@163647936046039040> ```" + JSON.stringify(err) + "```").catch(() => {});
						}

						var res = "Successfully received your votes for ```"
						nomUser.forEach(user => {
							res += user.username + ", "
						});
						if (res.substr(res.length - 2, res.length) === ", ")
							res = res.substr(0, res.length - 2)
						res += " ```\nSee you at the allstars match."
						// send response
						msg.author.sendMessage(res).catch(() => {});
					});
				}
			});
		}

		// msg.delete()
	}

	module.getVotes = (msg) => {
		connection.query("SELECT vote FROM fissure.all_stars", (error, results, fields) => {
			let user = {}

			let validVotes = 0
			let invalidVotes = 0

			let oldVotes = 0

			results.forEach((result) => {
				let votes = JSON.parse(result.vote)

				if (votes.length < 5)
					invalidVotes += 1
				else {
					validVotes += 1

					votes.forEach((vote) => {
						if (typeof vote == "string") {
							oldVotes += 1
							if (!user[oldVotes]) {
								user[oldVotes] = {
									username: vote.toLowerCase()
								}
								user[oldVotes].count = 0
							}

							user[oldVotes].count += 1
						} else {
							if (!user[vote.id]) {
								user[vote.id] = {
									username: vote.username.toLowerCase()
								}
								user[vote.id].count = 0
							}

							user[vote.id].count += 1
						}
					})
				}
			})

			let merged = {}

			for (var prop in user) {
				if (!merged[user[prop].username])
					merged[user[prop].username] = 0


				merged[user[prop].username] += user[prop].count
			}

			let sortable = []

			for (var name in merged) {
				sortable.push([name, merged[name]]);
			}

			sortable.sort((a, b) => {
				return b[1] - a[1];
			});

			var niceLayout = "";

			sortable.forEach((el) => {
				niceLayout += el[0] + " - " + el[1] + "\n";
			});

			let filePath = __dirname + "/allstars_votes/" + (new Date()).toJSON() + ".txt"

			fs.writeFile(filePath, niceLayout, (err) => {
				if (err) {
					console.error(err);
				}

				// msg.author.sendMessage().catch(() => {})
				let response = `Valid votes: ${validVotes}
Invalid votes (< 5 votes): ${invalidVotes}
Votes from old system: ${oldVotes}
The current results, please check by hand for duplicates or not counted votes. xoxo <@163647936046039040>`
				msg.author.sendFile(filePath, filePath.substr(2), response)
			})
		})
	}

	return module;
}