module.exports = function (bot, core) {
    var module = {}
    var mysql = require('mysql');
    const config = require('../../config.json')
    const connection = mysql.createConnection({
        host: config.mysql_host,
        port: config.mysql_port,
        user: config.mysql_user,
        password: config.mysql_pwd,
        database: config.mysql_db
    });
    module.getPlayer = function (message, channel, user) {
        var pattern = /!getplayer (\d+)/i
        var match = pattern.exec(message);
        //match[1] = id number requested
        var id = match[1];
        if (id && id.length === 17) {
            connection.query('SELECT users.username, users.dota_id, users.solo_mmr, users.party_mmr, users.el_rank, users.team_id, users.availability FROM fissure.users WHERE id=?', [id], (err, rows) => {
                if (err) {
                    console.log('Error getting player');
                    console.error(err);
                } else if (rows.length > 0) {
                    if (rows[0].team_id === null) {
                        var privateMsg = 'Stats Report on Player ' + rows[0].username + ' (' + id + '):' +
                            '\nUsername: ' + rows[0].username +
                            '\nSolo MMR: ' + rows[0].solo_mmr +
                            '\nParty MMR: ' + rows[0].party_mmr +
                            '\nEcho League Rank: ' + rows[0].el_rank +
                            '\nNo Team';
                    } else {
                        var privateMsg = 'Stats Report on Player ' + rows[0].username + ' (' + id + '):' +
                            'Username: ' + rows[0].username +
                            '\nSolo MMR: ' + rows[0].solo_mmr +
                            '\nParty MMR: ' + rows[0].party_mmr +
                            '\nEcho League Rank: ' + rows[0].el_rank +
                            '\nTeam ' + rows[0].team_id;
                    }
                    // console.log('Got Player')
                    user.sendMessage(privateMsg);
                }
            });
        } else {
            user.sendMessage("That is not a valid steam ID.");
        }
    }
    module.comparePlayers = function (message, channel, user) {
        var pattern = /(\d+) (\d+)/
        var match = pattern.exec(message);
        // console.log(match);
        if (match) {
            var player = match[1];
            var standin = match[2];
        } else {
            user.sendMessage("Standin use requires two steam IDs.")
        }
        var playerEL = 0;
        var playerName = "";
        var standinEL = 0;
        var standinName = ""
        // console.log('1: ' + player + ' 2: ' + standin)
        if (match && match[1].length === 17 && match[2].length === 17) {
            connection.query('SELECT users.el_rank, users.username FROM fissure.users WHERE id=?', [player], (err, rows) => {
                if (err) {
                    console.log('Error with player')
                    console.error(err)
                }
                if (rows.length > 0) {
                    playerEL = rows[0].el_rank;
                    playerName = rows[0].username;
                    // console.log(rows[0].username + ' player');
                    // console.log(rows[0].el_rank);
                    connection.query('SELECT users.el_rank, users.username FROM fissure.users WHERE id=?', [standin], (err, rows) => {
                        if (err) {
                            console.log('Error with standin')
                        }
                        if (rows.length > 0) {
                            standinEL = rows[0].el_rank;
                            standinName = rows[0].username;
                            // console.log(rows[0].username + ' standin');
                            // console.log(rows[0].el_rank);
                            if (playerEL < standinEL) {
                                user.sendMessage(standinName + " cannot stand in for " + playerName + " due to Echo League Rank being too high.");
                                // console.log(playerEL + standinEL);
                            } else {
                                user.sendMessage(standinName + " can standin for " + playerName + "!");
                                // console.log(playerEL + standinEL);
                            }
                        } else {
                            user.sendMessage("ID(s) not valid or player(s) not registered");
                            // console.log('ID(s) not valid or player(s) not registered');
                        }
                    });
                } else {
                    user.sendMessage("ID(s) not valid or player(s) not registered");
                    // console.log('ID(s) not valid or player(s) not registered');
                }

            });
        } else {
            user.sendMessage("One or both of the steam IDs used is not valid.");
        }
    }


    return module;
}