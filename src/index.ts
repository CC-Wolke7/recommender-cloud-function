import {createConnection} from "mysql";
import * as qs from "qs";
import axios from "axios";
import {promisify} from "util";


const RECOMMENDER_BOT_TOKEN = 'NTZiYWU4YjE1ZmQyYzdlMGViZDI1Y2EzODMzZTUxZjQK';
const RECOMMENDER_BOT_USER_UUID = '5a994e8e-7dbe-4a61-9a21-b0f45d1bffbd';
const baseURL = 'http://localhost:3000';


interface RecommenderMessage {
    breed: string
}

interface Chat {
    uuid: string
    creator: string
    participants: string[]
}

interface Message {
    uuid: string
    chat: string
    sender: string
    date: string
    body: string
}

async function recommend(_ignored: any, data: RecommenderMessage) {
    const breed = data.breed;
    const sql_query = `SELECT user_list FROM breed_user_list WHERE breed = "${breed}"`;

    const con = createConnection({
        host: "localhost",
        user: "root",
        password: "rootybooty",
        database: "wolkesieben_local"
    });

    const connect = promisify(con.connect).bind(con);
    await connect();

    const query = promisify(con.query).bind(con);

    const user_uuids: string[] = ((await query(sql_query)) as any)[0].user_list.split(',');

    // const user_uuids = ['6b38d913-7eb3-42f3-a340-15549c247430'];

    for (const user_uuid of user_uuids) {
        const participants = [RECOMMENDER_BOT_USER_UUID, user_uuid];

        const participants_query = qs.stringify({
            participants: participants
        }, {arrayFormat: 'indices'});

        let chat_id: string;

        const chats = (await axios.get<Chat[]>(baseURL + '/chats',
            {params: participants_query, headers: {Authorization: `Bearer ${RECOMMENDER_BOT_TOKEN}`}})).data;

        // TODO strict equal
        if (chats.length > 0) {
            chat_id = chats[0].uuid;
        } else {

            console.log('No chat with bot has been found for user with uuid ' + user_uuid + '. Will now instantiate chat');

            const chat = (await axios.post<Chat>(baseURL + '/chats/', {participants: participants},
                {headers: {Authorization: `Bearer ${RECOMMENDER_BOT_TOKEN}`}})).data;

            chat_id = chat.uuid;
        }

        await axios.post<Message>(`${baseURL}/chat/${chat_id}/messages`,
            {message: 'See this cute new ' + breed}, {
                headers:
                    {Authorization: `Bearer ${RECOMMENDER_BOT_TOKEN}`}
            });

        console.log('Message has been sent to user ' + user_uuid);

    }

}

export default recommend;
