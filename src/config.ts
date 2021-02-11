import dotenv from 'dotenv';
dotenv.config();

interface Environment extends NodeJS.ProcessEnv {
  RECOMMENDER_BOT_TOKEN: string;
  RECOMMENDER_BOT_USER_UUID: string;

  CHAT_API_URL: string;
  APP_SERVICE_URL: string;
}

interface Config {
  recommenderBot: {
    token: string;
    uuid: string;
  };
  chatApiUrl: string;
  appServiceUrl: string;
}

const environment = process.env as Environment;

const {
  RECOMMENDER_BOT_TOKEN,
  RECOMMENDER_BOT_USER_UUID,
  CHAT_API_URL,
  APP_SERVICE_URL,
} = environment;

export const config: Config = {
  recommenderBot: {
    token: RECOMMENDER_BOT_TOKEN,
    uuid: RECOMMENDER_BOT_USER_UUID,
  },
  chatApiUrl: CHAT_API_URL,
  appServiceUrl: APP_SERVICE_URL,
};
