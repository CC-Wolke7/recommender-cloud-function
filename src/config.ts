import dotenv from 'dotenv';
dotenv.config();

interface Environment extends NodeJS.ProcessEnv {
  RECOMMENDER_BOT_TOKEN: string;
  RECOMMENDER_BOT_USER_UUID: string;

  CHAT_API_URL: string;

  DATABASE_HOST: string;
  DATABASE_PORT: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
}

interface Config {
  recommenderBot: {
    token: string;
    uuid: string;
  };
  chatApiUrl: string;
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
}

const environment = process.env as Environment;

const {
  RECOMMENDER_BOT_TOKEN,
  RECOMMENDER_BOT_USER_UUID,
  CHAT_API_URL,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = environment;

export const config: Config = {
  recommenderBot: {
    token: RECOMMENDER_BOT_TOKEN,
    uuid: RECOMMENDER_BOT_USER_UUID,
  },
  chatApiUrl: CHAT_API_URL,
  database: {
    host: DATABASE_HOST,
    port: Number.parseInt(DATABASE_PORT),
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    name: DATABASE_NAME,
  },
};
