import 'reflect-metadata';

import { BotClient } from './client';

require('dotenv').config();

const client: BotClient = new BotClient({
  token: process.env.CLIENT_TOKEN,
  owners: process.env.OWNER,
  prefix: process.env.PREFIX,
});

client.start();
