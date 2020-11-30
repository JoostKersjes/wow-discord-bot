# wow-discord-bot

A TypeScript Discord bot for WoW guilds.

Updated to Shadowlands with the 2.0.0 release!

## environment variables

To run the bot, you need a `.env` file with the following contents:

```
CLIENT_TOKEN=[YOUR_BOT_TOKEN]
OWNER=[YOUR_OWNER_ID]
PREFIX=[DEFAULT_BOT_PREFIX]
```

## starting the bot

In the root of the project run `npm install` and `tsc`.
In the `dist/` folder, run `node bot.js` to start the bot.

Use the `!help` command to get a helpful explanation.
