const mysql = require('mysql');
const axios = require('axios');
const http = require('http');
const mockserver = require('mockserver');

const BOT_ID = 999;
const baseURL = 'http://localhost:9001';

http.createServer(mockserver('_mocks/')).listen(9001);

exports.recommend = (_ignored, data) => {
  const msg = data.message;
  // if base64 encoded:
  // const race = msg.race ? Buffer.from(msg.race, 'base64').toString() : 'None';

  // else:
  const race = msg.race;
  const sql_query = `SELECT user_list FROM race_user_list WHERE race = "${race}"`;

  // connect to db
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootybooty",
    database: "wolkesieben_local"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log('Connected to DB.');
    con.query(sql_query, function (err, result) {
      if (err) throw err;

      const user_list = JSON.parse("[" + result[0].user_list + "]");
      console.log('Sending messages to users ' + user_list);

      // send message to each user in user list
      user_list.forEach((user_id) => {
        const chatID = BOT_ID + ',' + user_id;

        // if bot and user have chatted before, just send message
        axios.get(baseURL + '/chats/?participants=' + chatID)
          .then(function (response) {
            // TODO header Authorization: Bearer <serviceToken>
            axios.post(baseURL + '/chats/:' + chatID + '/messages/', {message: 'See this cute new ' + race})
              .then(function (response) {
                console.log('Message has been sent to user ' + user_id);
            }).catch(function (error) {
                console.log(error);
            });
          })
            // if they have never chatted before (chat is not found), send post request to /chats/
          .catch(function (error) {
            if (error.response.status === 404){
              console.log('No chat has been found for chatID ' + chatID + '. Will now instantiate chat');
              axios.post(baseURL + '/chats/', {participants: chatID})
                  .then(function (response) {
                    console.log('Message has been sent to user ' + user_id);
                  }).catch(function (error) {
                    console.log(error);
              });
            }
        });
      });
    });
  });
};