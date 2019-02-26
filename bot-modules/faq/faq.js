/*
&261707169353826314 role ID for EchoLeagueStaff
125813798341705728 ID for BaD
81879907566628864 ID for UD
#263852760275877888 ID for #help
*/
module.exports = function (bot, core) {
    var module = {}
    module.RegStart = function (channel, user) {
        core.isBotOn(function () {
            var RegStartMsg = "Hi, <@" + user.id + ">! Registration for Season 2 began on May 10th, 2017 and ends on May 31th, 2017. Group stages will begin as early as June 5th, 2017.";
            channel.sendMessage(RegStartMsg);
        });
    }
    module.RegEnd = function (channel, user) {
        core.isBotOn(function () {
            var RegEndMsg = "Hi, <@" + user.id + ">! Registration for Season 2 ends on May 31th, 2017. Group stages will begin as early as June 5th, 2017.";
            channel.sendMessage(RegEndMsg);
        });
    }
    module.TeamCalc = function (channel, user) {
        core.isBotOn(function () {
            var teamCalcMsg = "Hi, <@" + user.id + ">! The calculator to find what division your team will play in is at http://calculator.echoleague.gg"
            channel.sendMessage(teamCalcMsg);
        });
    }
    module.TeamForm = function (channel, user) {
        core.isBotOn(function () {
            var teamFormMsg = "Hi, <@" + user.id + ">! Teams are formed by either posting a help ticket on the EchoLeague website or private messaging an admin after all your players are registered with your team name, team organizer, optional team logo, region and the IDs of each player on your team (minimum of 5 and maximum of 7 players). To add, remove or replace a member on your team indicate the desired change in your message along with the ID of any member to be added, removed or replaced.";
            channel.sendMessage(teamFormMsg);
        });
    }
    module.echoBark = function (channel, user) {
        core.isBotOn(function () {
            var CapMessageMsg = "Bark bark. Woof woof."
            channel.sendMessage(CapMessageMsg);
        });
    }
    module.adminHere = function (channel, user) {
        core.isBotOn(function () {
            var adminHereMsg = "Please ask your question in <#263852760275877888> <@" + user.id + ">, or send a private message to one of the <@&261707169353826314> members. A staff member will reply as soon as one is available.";
            channel.sendMessage(adminHereMsg);
        });
    }
    module.noResponse = function (channel, user) {
        core.isBotOn(function () {
            var noResponseMsg = "All correspondence with other Team Organizers should be documented with screen shots. If the other Team Organizer doesn't respond then provide all screen shots of attempts to contact them to a staff member."
            channel.sendMessage(noResponseMsg);
        });
    }
    module.standins = function (channel, user) {
        core.isBotOn(function () {
            var standinsMsg = "In order to get a standin approved you must send a pm to a staff member with the following information: \n\n>A link to the profile of the player standing in and the player who will be stood in for, \n>A screenshot of the MMR of the player who needs to be stood in for from the DotA client \n>The game(s) that the standin is needed for. \n\nKeep in mind that standins must be players registered in this season of Echo League who are not in your group and who are either lower than or equal to the weighted rank of the player you are replacing."
            channel.sendMessage(standinsMsg);
        });
    }
    module.lateRules = function (channel, user) {
        core.isBotOn(function () {
            var lateRulesMsg = "If the other team is not ready to play after a certain amount of time penalties will be applied. After 10 minutes all reserve time is lost, after 15 minutes the first game of series is forfeit, after 20 minutes the entire series is forfeit."
            channel.sendMessage(lateRulesMsg);
        });
    }
    module.MMRCap = function (channel, user) {
        core.isBotOn(function () {
            var MMRCapMsg = "The overall MMR cap is 5500 MMR. The individual MMR cap for division C is 3780 MMR and for division B it is 4790 MMR."
            channel.sendMessage(MMRCapMsg);
        });
    }
    module.divQuestion = function (channel, user) {
        core.isBotOn(function () {
            var divQuestionMsg = "There are 3 divisions: A, B and C. Which division a team plays in depends on a team's total number of weighted points. If a team is worth less than 80 points they are in division C, if they are worth more than 80, but less than 226 points they are in division B. Individual players are also taken into account: if a player is worth 28 points or more (3780 MMR or higher) their team is immediately placed in group B, if they are worth 105 points or more (4790 MMR or higher) their team is immediately placed in group A. To find out which division your team will play in go to http://calculator.echoleague.gg"
            channel.sendMessage(divQuestionMsg);
        });
    }
    module.pointQuestion = function (channel, user) {
        core.isBotOn(function () {
            var pointQuestionMsg = "Hi <@" + user.id + ">! The Echo League points are a weighted system in order to better determine which teams belong in which division. The quick explanation is that it provides a direct way to compare MMR values to each other. The calculator for which division a team will play in can be found at http://calculator.echoleague.gg"
            channel.sendMessage(pointQuestionMsg);
        });
    }
    module.dogShell = function (channel, user) {
        core.isBotOn(function () {
            var dogShellMsg = "<:DogShell:265377106161172490>";
            channel.sendMessage(dogShellMsg);
        });
    }

    return module;
}