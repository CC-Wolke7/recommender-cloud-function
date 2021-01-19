const mysql = require('mysql');
const axios = require('axios').default;
const qs = require('qs')

const BOT_UUID = '7c8a6ec3-fc0f-4e0f-95ac-e25f3500c157'
const BOT_SERVICE_TOKEN = 'NTZiYWU4YjE1ZmQyYzdlMGViZDI1Y2EzODMzZTUxZjQK'
const baseURL = 'http://localhost:3000';

function logError(error) {
    console.error("Error response:");
    console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
}


async function example(participants){
    return await axios.post(baseURL + '/chats/', {participants: participants}, {headers: {Authorization: 'Bearer ' + BOT_SERVICE_TOKEN}});
}

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
                const participants = [BOT_UUID, user_uuid];

                const participants_query = qs.stringify({
                    participants: participants
                }, {arrayFormat: 'indices'});

                let chat_id;

                const chat_exists_response = await axios.get(baseURL + '/chats/?' + participants_query,
                    {headers: {Authorization: 'Bearer ' + BOT_SERVICE_TOKEN}});

                if (typeof(chat_exists_response.data) != 'undefined') {
                    chat_id = chat_exists_response.data[0].uuid;
                } else {

                    console.log('No chat with bot has been found for user with uuid ' + user_uuid + '. Will now instantiate chat');

                    const chat_id_response = await axios.post(baseURL + '/chats/', {participants: participants},
                        {headers: {Authorization: 'Bearer ' + BOT_SERVICE_TOKEN}});

                    chat_id = chat_id_response.data.uuid;
                }

                const send_msg_response = await axios.post(baseURL + '/chat/' + chat_id + '/messages',
                    {message: 'See this cute new ' + breed}, {headers:
                            {Authorization: 'Bearer ' + BOT_SERVICE_TOKEN}});

                console.log('Message has been sent to user ' + user_uuid);

            }

                /*

                con.connect(function (err) {
                    if (err) throw err;
                    console.log('Connected to DB.');
                    con.query(sql_query, function (err, result) {
                        if (err) throw err;

                        //const user_uuids = result[0].user_list.split(',')//JSON.parse('[' + result[0].user_list + ']');
                        //console.log(user_uuids);

                        const user_uuids = ['6b38d913-7eb3-42f3-a340-15549c247426'];


                        user_uuids.forEach((user_uuid) => {
                            const participants = [BOT_UUID, user_uuid];

                            const participants_query = qs.stringify({
                                participants: participants
                            }, {arrayFormat: 'indices'});

                            var chat_id;

                            axios.get(baseURL + '/chats/?' + participants_query,
                                {headers: {Authorization: 'Bearer ' + BOT_SERVICE_TOKEN}})

                                .then(async function (response) {

                                    if (response.data.length > 0) {
                                        chat_id = response.data[0].uuid; // overwrites

                                    } else {
                                        console.log('No chat with bot has been found for user with uuid ' + user_uuid + '. Will now instantiate chat');

                                        //chat_id = await example(participants);

                                        const response = await axios.post(baseURL + '/chats/', {participants: participants},
                                            {headers: {Authorization: 'Bearer ' + BOT_SERVICE_TOKEN}});

                                        console.log('Chat ID: ' + response.data.uuid);
                                        chat_id = response.data.uuid; // does not overwrite ?!

                                    }

                                    console.log(chat_id);

                                    axios.post(baseURL + '/chat/' + chat_id + '/messages', {message: 'See this cute new ' + breed},
                                        {headers: {Authorization: 'Bearer ' + BOT_SERVICE_TOKEN}})
                                        .then(function (response) {
                                            console.log('Message has been sent to user ' + user_uuid);
                                        }).catch(function (error) {
                                        logError(error);
                                    });


                                })
                                .catch(function (error) {
                                    logError(error);
                                });
                        });
                    });
                });*/
            });
        })};