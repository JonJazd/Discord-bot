module.exports = function (bot, core) {
    var module = {}
    var mysql = require('mysql');
    var config = require('../../config.json');
    const connection = mysql.createConnection({
        host: config.mysql_host,
        port: config.mysql_port,
        user: config.mysql_user,
        password: config.mysql_pwd,
        database: config.mysql_db
    });
    /* 
    Upon providing a proper code after a !link command the discord ID and Friend ID (user#1234) 
    will be attached to the profile of the player matching said code in the db
    */
    module.check = function (msg, user, channel) {
        const reg = /!link (.+)/
        const match = reg.exec(msg);
        console.log(match[1]);
        connection.query('SELECT * FROM users WHERE discord_code=?', [match[1]], (err, user1) => {
            if (err) {
                console.log('Err getting user')
                user.sendMessage('That code could not be found. Please check that it was entered correctly.');
            }
            else if (user1.length === 1 && user1[0].discord === null && user1[0].discord_id === null && channel.type === 'dm') {
                const userID = user.id;
                const user1name = user1[0].username;
                const userFriendID = user.username + "#" + user.discriminator;
                if (userFriendID === null) {
                    user.sendMessage('There was an error capturing your username. Please try again. If this error happens again please contact an admin.');
                    return;
                }
                connection.query('UPDATE users SET discord_id=?, discord=? WHERE discord_code=?', [userID, userFriendID, match[1]], (err, done) => {
                    if (err) {
                        console.log('Could not update')
                        console.log(err)
                        user.sendMessage('Unknown error has occured. Please contact an admin.');
                    }
                    if (done) {
                        user.sendMessage('Your discord name has been linked!');
                        // EL server ID 261386843923283970
                        const EL = bot.guilds.get('261386843923283970');
                        const updateUser = EL.members.get(userID);
                        console.log(user1name)
                        updateUser.setNickname(user1name)
                        connection.query('UPDATE users SET discord_code=? WHERE discord_code=?', [null, match[1]], (err) => {
                            if (err) {
                                console.log('Did not change code to null');
                            }
                        })
                    }
                })
            }
            else {
                if (user1.length > 0) {
                    console.log(user1.length);
                    console.log(user1[0].discord);
                    console.log(user1[0].discord_id);
                }
                if (channel.type !== "dm") {
                    user.sendMessage('Please only use the !link command in a PM channel.');
                } else {
                    user.sendMessage('An error has occured. Please send a message to an admin with your discord link code.');
                }
            }
        })
    }
    /*
    Will look for the given discord ID and update the friend ID for the user.
    */
    module.update = function () {
        const updateFunc = function (a, userlength, users) {
            const discID = users[a].discord_id
            const user = bot.users.get(discID);
            if (user === undefined) {
                if (a < userlength) {
                    console.log('Error getting user #' + a);
                    updateFunc(a + 1, userlength, users);
                }
            } else {
                const userFID = user.username + "#" + user.discriminator;
                connection.query('UPDATE users SET discord=? WHERE discord_id=?', [userFID, discID], (err, done) => {
                    if (err) {
                        console.log('There was an error updating user' + discID + " " + userFID);
                    } else if (done) {
                        console.log('updated user #' + a)
                        connection.query('SELECT * FROM users WHERE discord_id=?', [discID], (err1, user1) => {
                            if (err1) {
                                console.log(err1);
                            }
                            if (user1 === undefined) {
                                if (a < userlength) {
                                    updateFunc(a + 1, userlength, users);
                                }
                            }
                            // EL server ID 261386843923283970
                            const EL = bot.guilds.get('261386843923283970');
                            const updateUser = EL.members.get(discID);
                            const newUserName = user1[0].username;
                            updateUser.setNickname(newUserName)
                                .then(() => {
                                    if (a < userlength - 1) {
                                        updateFunc(a + 1, userlength, users);
                                    }
                                })
                                .catch(() => {
                                    if (a < userlength - 1) {
                                        updateFunc(a + 1, userlength, users);
                                    }
                                });

                        })
                    } else {
                        console.log('unknown error during update')
                    }
                })
            }
        }
        connection.query('SELECT discord_id FROM users WHERE discord_id IS NOT NULL', (err, users) => {
            if (err) {
                console.log('could not get users')
            }
            else if (users.length > 0) {
                updateFunc(0, users.length, users);
            } else {
                console.log('no users found')
            }
        }
        )
    }

    return module;
}