module.exports = function (bot, core) {
	var module = {}

	/**
	 * Sends PM with basic commands and help to user
	 * @param {object} channel Channel that message came from
	 * @param {object} user    User that wrote message
	 */
	module.showHelp = function (channel, user) {
		//makes sure bot is on
		core.isBotOn(function () {
			//creates messasge using user's name
			var helpMsgPmed = "Hi, <@" + user.id + ">! Please check your PM for information on how to use me."
			var helpMsg = "Hi, I'm Echo Bot!\n\n" +
				"I help moderate our server!  You don't need to do anything special, I'll just respond to your questions if I think I can answer it! \n\n" +
				// "You can also ask me to see a users DotA Stats like this `!stats 7533510`\n\n" +
				"If there are any issues with the me, ping @Upstairs/Downstairs, @BaD, @Grey or log an issue here: https://gitlab.com/DogShell_Development/echo-slam/issues\n\n";
			core.checkUser(user, 'admins', function () {
				//sends message without admin extras otherwise
				channel.sendMessage(helpMsgPmed);
				user.sendMessage(helpMsg);
			}, function () {
				//sends message without admin extras otherwise
				channel.sendMessage(helpMsgPmed);
				user.sendMessage(helpMsg);
			});
		});
	};

	/**
	 * Sends message if invalid command is issued in server
	 * @param {object} channel Channel that message came from
	 */
	module.showInvalidCommand = function (channel) {
		//checks to make sure bot is on
		core.isBotOn(function () {
			var invalidCommandMsg = "That was an invalid command. Try again. Use !help for help."
			//sends message to user letting them know command is invalid
			channel.sendMessage(invalidCommandMsg);
		});

	}
	return module;
};