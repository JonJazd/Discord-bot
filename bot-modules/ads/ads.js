module.exports = function (bot, core) {
	var module = {}
	var mysql = require('mysql');
	var config = require('../../config.json');
	var moment = require('moment');
	const connection = mysql.createConnection({
		host: config.mysql_host,
		port: config.mysql_port,
		user: config.mysql_user,
		password: config.mysql_pwd,
		database: config.mysql_db
	});
	//var general = bot.channels.get('265402026219929601');
	/*
	265402026219929601 Id for general */
	var FYMmsg = "Awooooo <:DogShell:265377106161172490>  Here's a quick mesage from our sponsors!\nLooking to spice up your life a bit?  Or maybe just your meals?  __**FYM Hot Sauce**__ has just what you're looking for!\n\nThe first batch of __**FYM Hot Sauce**__ was grown in a couple of pots with plants bought at a local nursery. After a few rounds of trial and error, the perfect recipe was created, and hot sauce nirvana was reached.  Since then they have experimented with varieties of other sauces to make different sauces for people who don't want their food quite so hot, and those who might actually be insane in the level of heat they require.\n\nCheck out with promo code ECHO over at http://echo.fymhotsauce.rocks to help support Echo League with your purchase"
	var PVGmsg = "Woof Bark <:DogShell:265377106161172490>  Here's a quick message from our sponsors!\nWant to get better at DotA 2?  Want to learn from the Pros themselves?  Then check out __**PVGNA**__!\n\n__**PVGNA**__ specializes in providing guides, analysis, and content from top DotA 2 pros (like Chessie, Fogged, Slahser) to help improve your game!  Through a variety of analysis videos, guided hero tutorials, and patch and meta guides, __**PVGNA**__ is focused on helping you hone your skills and improving your DotA 2 play.\n\nSign up with referral link https://pvgna.com/?ref=echo to find your competitive edge and support Echo League today!"
	module.runFYM = function () {
		var expireTime = (moment(new Date()).add(5, 'hours').format('YYYY-MM-DD hh:mm'));
		var dated = moment(new Date()).format('YYYY-MM-DD hh:mm');
		var general = bot.channels.get('265402026219929601')
		connection.query('SELECT logs.req_body FROM fissure.logs WHERE user=?', ["bot"], (err, quer) => {
			if (err) {
				console.log('error on SELECT query for ad.')
				console.error(err)
			} else if (quer) {
				// console.log(quer)
				if (moment(dated).isAfter(quer[quer.length - 1].req_body)) {
					// console.log('Current time is after time stamp')
					general.sendMessage(FYMmsg)
						.catch(() => {
							console.log('Error sending ad message.')
						})
						.then(() => {
							connection.query('INSERT INTO fissure.logs (timestamp,type,user,info,req_body) VALUES (?,?,?,?,?)', [dated, 'ad run', 'bot', 'FYM ad', expireTime], (err) => {
								if (err) {
									console.log('could not insert data into table for FYM ad run.')
									console.error(err)
								} else {
									// console.log('Running ad.')
									var a = 1
								}
							})
						});
					setInterval(function () {
						if (a % 2 === 0) {
							var AdMsg = FYMmsg;
						} else {
							var AdMsg = PVGmsg;
						}
						let currentTime = moment(new Date()).format('YYYY-MM-DD hh:mm');
						let expireTime1 = moment(new Date()).add(5, 'hours').format('YYYY-MM-DD hh:mm');
						connection.query('SELECT logs.req_body FROM fissure.logs WHERE user=?', ["bot"], (err, timestamp) => {
							if (err) {
								console.log('Could not get last timestamp')
								console.error(err)
							}
							if (moment(currentTime).isAfter(quer[quer.length - 1].req_body)) {
								general.sendMessage(AdMsg)
									.catch(() => {
										console.log('Error sending ad message.')
									})
									.then(() => {
										if (AdMsg === FYMmsg) {
											var expireTime = (moment(new Date()).add(5, 'hours').format('YYYY-MM-DD hh:mm'));
											var dated = moment(new Date()).format('YYYY-MM-DD hh:mm');
											connection.query('INSERT INTO fissure.logs (timestamp,type,user,info,req_body) VALUES (?,?,?,?,?)', [currentTime, 'ad run', 'bot', 'FYM ad', expireTime1], (err) => {
												if (err) {
													console.log('could not insert data into table for FYM ad run.')
													console.error(err)
												}
											});
										} else if (AdMsg === PVGmsg) {
											var expireTime = (moment(new Date()).add(5, 'hours').format('YYYY-MM-DD hh:mm'));
											var dated = moment(new Date()).format('YYYY-MM-DD hh:mm');
											connection.query('INSERT INTO fissure.logs (timestamp,type,user,info,req_body) VALUES (?,?,?,?,?)', [currentTime, 'ad run', 'bot', 'PVG ad', expireTime1], (err) => {
												if (err) {
													console.log('could not insert data into table for PVGNA ad run.')
													console.error(err)
												}
											});
										}
									})
								// console.log('Running ad.');
								a++
							}
						})
						//18000000
					}, 18000000);
				} else {
					// console.log('Trying to send an ad again too soon');
				}
			}
		});
	}
	module.runPVG = function () {
		var expireTime = (moment(new Date()).add(5, 'hours').format('YYYY-MM-DD hh:mm'));
		var dated = moment(new Date()).format('YYYY-MM-DD hh:mm');
		var general = bot.channels.get('265402026219929601')
		connection.query('SELECT logs.req_body FROM fissure.logs WHERE user=?', ["bot"], (err, quer) => {
			if (err) {
				console.log('error on SELECT query for ad.')
				console.error(err)
			} else if (quer) {
				// console.log(quer)
				if (moment(dated).isAfter(quer[quer.length - 1].req_body)) {
					general.sendMessage(PVGmsg)
						.catch(() => {
							console.log('Error sending ad message.')
						})
						.then(() => {
							connection.query('INSERT INTO fissure.logs (timestamp,type,user,info,req_body) VALUES (?,?,?,?,?)', [dated, 'ad run', 'bot', 'PVG ad', expireTime], (err) => {
								if (err) {
									console.log('could not insert data into table for PVGNA ad run.')
									console.error(err)
								} else {
									// console.log('Running ad.')
									var a = 1
								}
								setInterval(function () {
									if (a % 2 === 1) {
										var AdMsg = FYMmsg;
									} else {
										var AdMsg = PVGmsg;
									}
									let currentTime = moment(new Date()).format('YYYY-MM-DD hh:mm');
									let expireTime1 = moment(new Date()).add(5, 'hours').format('YYYY-MM-DD hh:mm');
									connection.query('SELECT logs.req_body FROM fissure.logs WHERE user=?', ["bot"], (err, timestamp) => {
										if (err) {
											console.log('Could not get last timestamp')
											console.error(err)
										}
										if (moment(currentTime).isAfter(quer[quer.length - 1].req_body)) {
											general.sendMessage(AdMsg)
												.catch(() => {
													console.log('Error sending ad message.')
												})
												.then(() => {
													if (AdMsg === FYMmsg) {
														var expireTime = (moment(new Date()).add(5, 'hours').format('YYYY-MM-DD hh:mm'));
														var dated = moment(new Date()).format('YYYY-MM-DD hh:mm');
														connection.query('INSERT INTO fissure.logs (timestamp,type,user,info,req_body) VALUES (?,?,?,?,?)', [currentTime, 'ad run', 'bot', 'FYM ad', expireTime1], (err) => {
															if (err) {
																console.log('could not insert data into table for FYM ad run.')
																console.error(err)
															}
														});
													} else if (AdMsg === PVGmsg) {
														var expireTime = (moment(new Date()).add(5, 'hours').format('YYYY-MM-DD hh:mm'));
														var dated = moment(new Date()).format('YYYY-MM-DD hh:mm');
														connection.query('INSERT INTO fissure.logs (timestamp,type,user,info,req_body) VALUES (?,?,?,?,?)', [currentTime, 'ad run', 'bot', 'PVG ad', expireTime1], (err) => {
															if (err) {
																console.log('could not insert data into table for PVGNA ad run.')
																console.error(err)
															}
														});
													}
												})
											// console.log('Running ad.');
											a++
										}
									})
									//18000000
								}, 18000000);
							});

						})
				} else {
					// console.log('Trying to send an ad again too soon.');
				}
			}
		})
	}
	return module;
}