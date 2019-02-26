# Echo Bot

A bot for Echo League Discord Servers

## Installation

Clone the bot and then run `npm install`.  

Then create an `auth.json` file with the following information:
```json
{
        "email" : "discordLogin@email.com",
        "password" : "mydiscordpassword",
        "firebaseServer" : "http://asdf.com",
        "apiai_key": "ABC123"
}
```

## Commands

I currently respond to the following commands:

* **!help**: PM's a user with some basic instructions

* **!stats *dotaid***: Fetches a user's DotA stats (require's a DotA ID to be passed in)

* **FAQs**: *Echo Bot* will respond to basic questions if it thinks it knows the answer!  No special commands needed, it will just read syntax and respond!

## Issues

If you find an issue with Echo Bot, [please report it here](https://gitlab.com/DogShell_Development/echo-slam/issues)
