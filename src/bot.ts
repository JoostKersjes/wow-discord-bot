import 'reflect-metadata';

import { BotClient } from './client';

import dotenv = require('dotenv');
dotenv.config();

const client: BotClient = new BotClient({
  token: process.env.CLIENT_TOKEN,
  owners: process.env.OWNER,
  prefix: process.env.PREFIX,
});

client.start();
