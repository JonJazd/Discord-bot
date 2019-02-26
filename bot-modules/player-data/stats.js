module.exports = function (bot, core, yasp) {
	var module = {}

	/**
	 *	@stats
	 *		- given a player ID, generate a report
	 *		  containing MMR stats, recent games, etc.
	 **/
	module.verify = function (message) {
		core.isBotOn(function () {
			var pattern = /^!stats (\d+)$/i;
			var matches = pattern.exec(message.content);
			if (!matches) {
				bot.reply(message, "you need to specify the DotA ID.");
				return;
			}
			var id = matches[1];
			bot.reply(message, "hang on, I'm sleuthing...");
			yasp.playerStats(id, function (json) {
				if (json.status != 'Success') {
					bot.reply(message, "whoops, something went wrong. Please tell jasus!");
					return;
				}
				var ret = "";
				ret += "Player: **" + json.name + "** | Solo: **" + json.soloMMR + "** | Party: **" + json.partyMMR + "** | Estimated: **" + json.estMMR + "**";
				ret += "\n";
				ret += "Games: **" + (parseInt(json.winLoss.wins) + parseInt(json.winLoss.losses)) + "** | Wins: **" + json.winLoss.wins + "** | Losses: **" + json.winLoss.losses + "** | **" + json.winLoss.winrate + "**";
				ret += "\n\n";
				ret += "**Most Played Heroes**";
				ret += "\n";
				for (var played of json.mostPlayed) {
					ret += "\t" + played.hero + ": " + played.games + " games (" + played.winrate + "%)";
					ret += "\n";
				}
				ret += "\n";
				ret += "**Recent Matches**";
				ret += "\n";
				var recentW = 0;
				var recentL = 0;
				for (var match of json.recentGames) {
					if (match.outcome === 'W') {
						recentW++;
					} else {
						recentL++;
					}
					var skill = "N/A";
					if (match.skillLevel == 1) {
						skill = "Normal";
					}
					if (match.skillLevel == 2) {
						skill = "High";
					}
					if (match.skillLevel == 3) {
						skill = "Very High";
					}
					ret += "\t[" + match.whenPlayed + "] Skill Level: **" + skill + "** | Outcome: **" + match.outcome + "** | Hero: **" + match.hero + "**";
					ret += "\n";
				}
				ret += "\n";
				ret += "**Trend**: Won " + recentW + "/" + (recentW + recentL) + " (" + Math.floor((recentW / (recentW + recentL)) * 100) + "%) of recent matches.";
				bot.sendMessage(message.channel, ret);
			});
		});

		return;

		core.isBotOn(function () {

			// ret_msg - return message to build across requests
			var ret_msg = "";

			// gather basic info - name, mmr, games played, etc. 
			request({
					uri: "https://yasp.co/players/" + id,
				},
				function (error, response, body) {
					var pattern;
					var player_name = "ERROR!"

					ret_msg +=
						ret_msg += "\n";
					ret_msg;
					bot.sendMessage(channel, ret_msg);
				}
			);
		});
	}
	return module;
};