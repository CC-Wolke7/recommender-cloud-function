import { config } from './config';
import * as qs from 'qs';
import axios from 'axios';
import { RecommenderMessage, Chat, Message } from './types';

export async function recommend(
  _: any,
  data: RecommenderMessage,
): Promise<void> {
  const breed = data.breed;
  const { recommenderBot, chatApiUrl, appServiceUrl } = config;

  const users = (
    await axios.get<string[]>(`${appServiceUrl}`, {
      params: {
        breed: breed,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'indices' });
      },
      headers: { Authorization: `Bearer ${recommenderBot.token}` },
    })
  ).data;

  for (const user of users) {
    const participants = [recommenderBot.uuid, user];

    const chats = (
      await axios.get<Chat[]>(`${chatApiUrl}/chats`, {
        params: {
          participants: participants,
          strictEqual: true,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'indices' });
        },
        headers: { Authorization: `Bearer ${recommenderBot.token}` },
      })
    ).data;

    let chatId: string;

    if (chats.length > 0) {
      chatId = chats[0].uuid;

      console.log(`Chat between bot and user ${user} already exists`);
    } else {
      console.log(
        `No chat with bot has been found for user with uuid ${user}. Will now instantiate chat`,
      );

      const chat = (
        await axios.post<Chat>(
          `${chatApiUrl}/chats/`,
          { participants: participants },
          { headers: { Authorization: `Bearer ${recommenderBot.token}` } },
        )
      ).data;

      chatId = chat.uuid;

      console.log(`Created new chat between bot and ${user}`);
    }
    console.log('ChatID: ' + chatId);

    await axios.post<Message>(
      `${chatApiUrl}/chat/${chatId}/messages`,
      { message: `See this cute new ${breed}` },
      {
        headers: { Authorization: `Bearer ${recommenderBot.token}` },
      },
    );

    console.log(`Message has been sent to user ${user}`);
  }
}
