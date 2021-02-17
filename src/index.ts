import { config } from './config';
import * as qs from 'qs';
import axios from 'axios';
import { Chat, Message, Event, Offer } from './types';
import { EventFunction } from '@google-cloud/functions-framework/build/src/functions';

export const recommend: EventFunction = async (data, context) => {
  const {
    recommenderBot,
    appFrontendUrl,
    appServiceUrl,
    chatServiceUrl,
  } = config;
  console.log({ config });

  const event = data as Event;
  console.log({ event });
  console.log({ context });

  const offer = JSON.parse(
    Buffer.from(event.data, 'base64').toString(),
  ) as Offer;
  console.log({ offer });

  const users = (
    await axios.get<string[]>(`${appServiceUrl}/subscribers?`, {
      params: {
        breed: offer.breed,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'indices' });
      },
      headers: { Authorization: `${recommenderBot.token}` },
    })
  ).data;

  if (users.length === 0) {
    console.log(`No users interested in offers for breed '${offer.breed}'`);
    return;
  } else {
    console.log(`Found ${users.length} interester users: ${users}`);
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

    const offerUrl = `${appFrontendUrl}/#/offer/${offer.uuid}`;
    const message = `Checkout this cute ${offer.breed} at:\n\n${offerUrl}`;

    console.log(
      `Sending an offer recommendation message to chat '${chatId}'...`,
    );

    await axios.post<Message>(
      `${chatServiceUrl}/chat/${chatId}/messages`,
      { message },
      {
        headers: { Authorization: `Bearer ${recommenderBot.token}` },
      },
    );

    console.log(`Sent offer recommendation message to user '${user}'`);
  }
};
