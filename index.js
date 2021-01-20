const mysql = require('mysql');
const axios = require('axios').default;
const qs = require('qs')

const RECOMMENDER_BOT_TOKEN = 'NTZiYWU4YjE1ZmQyYzdlMGViZDI1Y2EzODMzZTUxZjQK';
const RECOMMENDER_BOT_USER_UUID = '5a994e8e-7dbe-4a61-9a21-b0f45d1bffbd';
const baseURL = 'http://localhost:3000';


exports.recommend = (_ignored, data) => {
    const msg = data.message;
    // if base64 encoded: const race = msg.race ? Buffer.from(msg.race, 'base64').toString() : 'None';

    const breed = msg.breed;
    const sql_query = `SELECT user_list FROM breed_user_list WHERE breed = "${breed}"`;

    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "rootybooty",
        database: "wolkesieben_local"
    });

    con.connect(function (err) {
        if (err) throw err;
        console.log('Connected to DB.');

        con.query(sql_query, async function (err, result) {
            if (err) throw err;

            // const user_uuids = result[0].user_list.split(',')
            const user_uuids = ['6b38d913-7eb3-42f3-a340-15549c247430'];

            for (const user_uuid of user_uuids) {
                const participants = [RECOMMENDER_BOT_USER_UUID, user_uuid];

                const participants_query = qs.stringify({
                    participants: participants
                }, {arrayFormat: 'indices'});

                let chat_id;

                const chat_exists_response = await axios.get(baseURL + '/chats/?' + participants_query,
                    {headers: {Authorization: 'Bearer ' + RECOMMENDER_BOT_TOKEN}});

                if (typeof(chat_exists_response.data) != 'undefined') {
                    chat_id = chat_exists_response.data[0].uuid;
                } else {

                    console.log('No chat with bot has been found for user with uuid ' + user_uuid + '. Will now instantiate chat');

                    const chat_id_response = await axios.post(baseURL + '/chats/', {participants: participants},
                        {headers: {Authorization: 'Bearer ' + RECOMMENDER_BOT_TOKEN}});

                    chat_id = chat_id_response.data.uuid;
                }

                const send_msg_response = await axios.post(baseURL + '/chat/' + chat_id + '/messages',
                    {message: 'See this cute new ' + breed}, {headers:
                            {Authorization: 'Bearer ' + RECOMMENDER_BOT_TOKEN}});

                console.log('Message has been sent to user ' + user_uuid);

            }
            });
        })};