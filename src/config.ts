import dotenv from 'dotenv';
dotenv.config();

interface Environment extends NodeJS.ProcessEnv {
  RECOMMENDER_BOT_TOKEN: string;
  RECOMMENDER_BOT_USER_UUID: string;

  APP_FRONTEND_URL: string;
  APP_SERVICE_URL: string;
  CHAT_SERVICE_URL: string;
}

interface Config {
  recommenderBot: {
    token: string;
    uuid: string;
  };
  appFrontendUrl: string;
  appServiceUrl: string;
  chatServiceUrl: string;
}

const environment = process.env as Environment;

const {
  RECOMMENDER_BOT_TOKEN,
  RECOMMENDER_BOT_USER_UUID,
  APP_FRONTEND_URL,
  APP_SERVICE_URL,
  CHAT_SERVICE_URL,
} = environment;

export const config: Config = {
  recommenderBot: {
    token: RECOMMENDER_BOT_TOKEN,
    uuid: RECOMMENDER_BOT_USER_UUID,
  },
  appFrontendUrl: APP_FRONTEND_URL,
  appServiceUrl: APP_SERVICE_URL,
  chatServiceUrl: CHAT_SERVICE_URL,
};
