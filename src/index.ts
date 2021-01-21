import { config } from './config';
import { createConnection } from 'mysql';
import * as qs from 'qs';
import axios from 'axios';
import { promisify } from 'util';
import { RecommenderMessage, Chat, Message } from './types';

export async function recommend(
  _: any,
  data: RecommenderMessage,
): Promise<void> {
  const breed = data.breed;
  const { recommenderBot, chatApiUrl, database } = config;
  const sqlQuery = `SELECT user_list FROM race_user_list WHERE race = "${breed}"`;

  const databaseConnection = createConnection({
    host: database.host,
    port: database.port,
    user: database.user,
    password: database.password,
    database: database.name,
  });

  const connect = promisify(databaseConnection.connect).bind(
    databaseConnection,
  );
  const query = promisify(databaseConnection.query).bind(databaseConnection);

  await connect();

  const users: string[] = ((await query(sqlQuery)) as any)[0].user_list.split(
    ',',
  );

  for (const user of users) {
    const participants = [recommenderBot.uuid, user];

    console.log(
      qs.stringify({ participants: participants, strictEqual: true }),
    );

    const chats = (
      await axios.get<Chat[]>(`${chatApiUrl}/chats`, {
        params: qs.stringify(
          {
            participants: participants,
            strictEqual: true,
          },
          { arrayFormat: 'indices' },
        ),
        headers: { Authorization: `Bearer ${recommenderBot.token}` },
      })
    ).data;

    let chatId: string;

    if (chats.length > 0) {
      chatId = chats[0].uuid;
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
    }

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
