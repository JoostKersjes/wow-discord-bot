import 'reflect-metadata';

import dotenv = require('dotenv');
import { BotClient } from './client';

dotenv.config();

const client: BotClient = new BotClient({
  token: process.env.CLIENT_TOKEN,
  owners: process.env.OWNER,
  prefix: process.env.PREFIX,
});

client.start();
