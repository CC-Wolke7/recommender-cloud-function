import { config } from './config';
import * as qs from 'qs';
import axios from 'axios';
import { RecommenderMessage, Chat, Message } from './types';
import { EventFunction } from '@google-cloud/functions-framework/build/src/functions';

export const recommend: EventFunction = async (data, context) => {
  console.log(data);
  console.log(atob(data as string));

  //const eventPayload = data as RecommenderMessage;

  // console.log({eventPayload: eventPayload});

  const breed = 'Jack Russel'; //eventPayload.breed;
  const offerUrl = 'test'; //eventPayload.offerUrl;

  if (!breed) {
    console.log("Invalid 'newOffer' event payload");
    return;
  }

  const { recommenderBot, appServiceUrl, chatServiceUrl } = config;
  console.log(appServiceUrl);

  const users = (
    await axios.get<string[]>(`${appServiceUrl}/breed`, {
      params: {
        breed: breed,
      },
      headers: { Authorization: `${recommenderBot.token}` },
    })
  ).data;

  console.log(users);

  if (users.length === 0) {
    console.log(`No users interested in offers for breed '${breed}'`);
    return;
  }

  for (const user of users) {
    const participants = [recommenderBot.uuid, user];

    const chats = (
      await axios.get<Chat[]>(`${chatServiceUrl}/chats`, {
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

      console.log(
        `Chat between recommender bot and user '${user}' already exists`,
      );
    } else {
      console.log(
        `No chat between recommender bot and user '${user}' found. Creating...`,
      );

      const chat = (
        await axios.post<Chat>(
          `${chatServiceUrl}/chats/`,
          { participants: participants },
          { headers: { Authorization: `Bearer ${recommenderBot.token}` } },
        )
      ).data;

      chatId = chat.uuid;

      console.log(
        `Created new chat between recommender bot and user '${user}'`,
      );
    }

    console.log(
      `Sending an offer recommendation message to chat '${chatId}'...`,
    );

    await axios.post<Message>(
      `${chatServiceUrl}/chat/${chatId}/messages`,
      { message: `Checkout this cute ${breed} at ${offerUrl}` },
      {
        headers: { Authorization: `Bearer ${recommenderBot.token}` },
      },
    );

    console.log(`Sent offer recommendation message to user '${user}'`);
  }
};
