import { config } from './config';
import * as qs from 'qs';
import axios from 'axios';
import { Chat, Message, EventPayloadObject } from './types';
import { EventFunction } from '@google-cloud/functions-framework/build/src/functions';

export const recommend: EventFunction = async (data, context) => {
  const eventPayload = data as EventPayloadObject;
  const recommend_data = JSON.parse(
    Buffer.from(eventPayload.data, 'base64').toString(),
  );

  const breed = recommend_data.breed;
  const offerUrl = recommend_data.offerUrl;

  if (!breed) {
    console.log("Invalid 'newOffer' event payload");
    return;
  }

  console.log(recommend_data);

  const { recommenderBot, appServiceUrl, chatServiceUrl } = config;
  console.log(appServiceUrl);
  console.log(chatServiceUrl);
  console.log(recommenderBot);

  console.log(qs.stringify({ breed: breed }, { arrayFormat: 'indices' }));

  const users = (
    await axios.get<string[]>(`${appServiceUrl}/subscribers?`, {
      params: {
        breed: breed,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'indices' });
      },
      headers: { Authorization: `${recommenderBot.token}` },
    })
  ).data;

  console.log(users);

  if (users.length === 0) {
    console.log(`No users interested in offers for breed '${breed}'`);
    return;
  }

  console.log(chatServiceUrl);

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

      console.log(recommenderBot.token);

      const chat = (
        await axios.post<Chat>(
          `${chatServiceUrl}/chats`,
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
      { message: `Checkout this cute ${breed} at ${offerUrl}!` },
      {
        headers: { Authorization: `Bearer ${recommenderBot.token}` },
      },
    );

    console.log(`Sent offer recommendation message to user '${user}'`);
  }
};
