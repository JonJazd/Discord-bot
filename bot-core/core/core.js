//Requirements
var Firebase = require("../../node_modules/firebase");
var AuthDetails = require('../../auth.json');

//Connect to Firebase DB
var firebaseDb = new Firebase(AuthDetails.firebaseServer);

module.exports = {

	/**
	 * Firebase Database Object
	 */
	database: firebaseDb,

	/**
	 * Queries databases and allows use of data found
	 * @param  {string}   drilldown   Path to object or value queried in relation to root DB
	 * @param  {Function} callback callback function that provides data value for object or record
	 */
	useDB: function (drilldown, callback) {
		this.database.child(drilldown).once('value', function (data) {
			callback(data.val());
		});
	},

	/**
	 * Checks to see if a user is a member of a specific group
	 * @param  {object} user    User that wrote message
	 * @param  {string} group   Name of group that the user is being checked against
	 * @param  {[type]} success Callback function run if the user is a member of the group they're checked against
	 * @param  {[type]} error   Callback function run if the user is NOT a member of the group they're checked against
	 */
	checkUser: function (user, group, success, error) {
		this.useDB('users/' + group, function (group) {
			if (group[user.id]) {
				success();
			} else {
				error();
			}
		});
	},

	/**
	 * Finds channel by name, returns ID
	 * @param  {string} name String of channel requested
	 * @return {string}      Numeric ID for channel as ID.  Will fail silently if failed to match
	 */
	findChannel: function (bot, name) {
		//parse through all channels on current server to find one with matching name
		for (var i = bot.channels.length - 1; i >= 0; i--) {
			if (bot.channels[i].name == name) {
				return bot.channels[i].id
			}
		}
	},

	/**
	 * Function that runs simple success callback if the bot is on.  Used to make sure events only run when bot is on 
	 * @param  {function}  success Callback function that runs if the bot is on
	 */
	isBotOn: function (success) {
		this.database.child('allowBot').once('value', function (bool) {
			if (bool.val()) {
				success();
			}
			//fail silently if bot is off
		});
	}
};