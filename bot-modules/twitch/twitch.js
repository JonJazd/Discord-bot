module.exports = function (bot, core) {
    var module = {}

    const mysql = require('mysql');
    const fetch = require('node-fetch');
    const CronJob = require('cron').CronJob;

    const config = require('../../config.json');
    const TwitchID = '1zs01cx9bmf3pihxsip20xil747vyl';

    const connection = mysql.createConnection({
        host: config.mysql_host,
        port: config.mysql_port,
        user: config.mysql_user,
        password: config.mysql_pwd,
        database: config.mysql_db
    });

    const query = (sql) => {
        return new Promise((res, rej) => {
            connection.query(sql, (err, results) => {
                if (err || results.length < 0) {
                    return rej(err);
                }

                res(results);
            });
        });
    };

    let ongoing = {};

    var general = '265402026219929601'
    //var generalCast = '266760981294743553';
    //var general = '248264153192595456'; /*TB general*/
    module.search = async () => {
        let results = await query('SELECT * FROM caster_bot WHERE enabled=1');
        results.forEach(async element => {
            try {
                if (!ongoing[element.twitchID]) {
                    let stream = await fetch(`https://api.twitch.tv/kraken/streams/${element.twitchID}`, {
                        headers: {
                            'Client-ID': TwitchID,
                            'Accept': 'application/vnd.twitchtv.v5+json'
                        }
                    });
                    let json = await stream.json();
                    if (json.stream != null) {
                        let streamTitle = json.stream.channel.status.toLowerCase();
                        let streamer = json.stream.channel.display_name;
                        let streamURL = json.stream.channel.url;

                        if (streamTitle.indexOf('echo league') !== -1 || streamTitle.indexOf('echoleague') !== -1) {
                            let genChannel = bot.channels.get(general);
                            await genChannel.sendMessage(`Woof! Bark! An Echo League stream has gone live!<:DogShell:265377106161172490>\n\nCome watch ${streamer} cast ${json.stream.channel.status} at:\n<${streamURL}>`);
                            ongoing[element.twitchID] = true;
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            }
        });
    }

    let cj = new CronJob('00 */2 * * * *', () => {
        module.search();
    }, null, true, 'America/Los_Angeles');

    new CronJob('00 */15 * * * *', async () => {
        Object.keys(ongoing).forEach(async tID => {
            try {
                let stream = await fetch(`https://api.twitch.tv/kraken/streams/${tID}`, {
                    headers: {
                        'Client-ID': TwitchID,
                        'Accept': 'application/vnd.twitchtv.v5+json'
                    }
                });
                let json = await stream.json();
                if (json.stream != null) {
                    let streamTitle = json.stream.channel.status.toLowerCase();
                    let streamer = json.stream.channel.display_name;
                    let streamURL = json.stream.channel.url;

                    if (streamTitle.indexOf('echo league') !== -1 || streamTitle.indexOf('echoleague') !== -1) {
                        let streamMsg = `Woof! Bark! An Echo League stream is still in progress!<:DogShell:265377106161172490>\n\nCome watch ${streamer} cast ${json.stream.channel.status} at:\n<${streamURL}>`
                        let genChannel = bot.channels.get(general);
                        await genChannel.sendMessage(streamMsg);
                    } else {
                        delete ongoing[element.twitchID];
                    }
                } else {
                    delete ongoing[element.twitchID];
                }
            } catch (e) {
                console.error(e);
            }
        })
    }, null, true, 'America/Los_Angeles');

    return module;
}