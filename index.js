const mysql = require('mysql');
const axios = require('axios');
const qs = require('qs')

const BOT_UUID = '7c8a6ec3-fc0f-4e0f-95ac-e25f3500c157'
const BOT_SERVICE_TOKEN = 'NTZiYWU4YjE1ZmQyYzdlMGViZDI1Y2EzODMzZTUxZjQK'
const baseURL = 'http://localhost:3000';

exports.recommend = (_ignored, data) => {
    const msg = data.message;
    // if base64 encoded: const race = msg.race ? Buffer.from(msg.race, 'base64').toString() : 'None';

    const breed = msg.breed;
    const sql_query = `SELECT user_list FROM race_user_list WHERE race = "${breed}"`;

    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "rootybooty",
        database: "wolkesieben_local"
    });

    con.connect(function (err) {
        if (err) throw err;
        console.log('Connected to DB.');
        con.query(sql_query, function (err, result) {
            if (err) throw err;

            // const user_list = JSON.parse("[" + result[0].user_list + "]");
            const user_uuids = ['4f975628-d872-4c49-86e7-a176aaf27f7b'];

            user_uuids.forEach((user_uuid) => {
                const participants = [BOT_UUID, user_uuid];

                const participants_query = qs.stringify({
                    participants: participants
                }, {arrayFormat: 'indices'});



                axios.get(baseURL + '/chats/' + participants_query,
                    {headers: {Authorization: 'Bearer ' + BOT_SERVICE_TOKEN}})

                    .then(function (response) {
                        console.log(response);
                        let chat_id;

                        if (response.data) {
                            chat_id = response.data['uuid'];

                        } else {
                            console.log('No chat with bot has been found for user with uuid ' + user_uuid + '. Will now instantiate chat');

                            axios.post(baseURL + '/chats/', {participants: participants_query})
                                .then(function (response) {
                                    chat_id = response.data
                                }).catch(function (error) {
                                console.log(error);
                            });

                        }

                        axios.post(baseURL + '/chats/' + chat_id + '/messages/', {message: 'See this cute new ' + breed})
                                .then(function (response) {
                                    console.log('Message has been sent to user ' + user_uuid);
                                }).catch(function (error) {
                                console.log(error);
                            });


                    })
                    .catch(function (error) {
                        console.error("Error response:");
                        console.error(error.response.data);
                        console.error(error.response.status);
                        console.error(error.response.headers);
                    });
            });
        });
    });
};