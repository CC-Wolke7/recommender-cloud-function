var mysql = require('mysql');

exports.recommend = (_ignored, data) => {
  const msg = data.message;
  // if base64 encoded:
  // const race = msg.race ? Buffer.from(msg.race, 'base64').toString() : 'None';

  // else:
  const race = msg.race;
  if (race === NULL) throw Error('No race provided.');

  const sql_query = `SELECT user_list FROM race_user_list WHERE race = "${race}"`;

  // connect to db
  var con = mysql.createConnection({
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
      // console.log(user_list);

      // TODO send a message to all user_ids in user_list ..

  });
});

};