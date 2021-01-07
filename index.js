/**
 * Background Cloud Function to be triggered by Pub/Sub.
 * This function is exported by index.js, and executed when
 * the trigger topic receives a message.
 *
 * @param _ignored
 * @param {object} data The event payload.
 *
 * Test in prod later:
    gcloud pubsub topics create MY_TOPIC # Create a Pub/Sub topic
    gcloud functions deploy MY_FUNCTION \
      --trigger-topic MY_TOPIC \
      --runtime nodejs10

    gcloud pubsub topics publish MY_TOPIC --message '{ "race": "golden_retriever" }'
**/

exports.recommend = (_ignored, data) => {
  const msg = data.message;
  // const race = msg.race ? Buffer.from(msg.race, 'base64').toString() : 'None';
  const race = msg.race ? msg.race : 'None';

  console.log(`Getting ${race} user list ..`)

  // TODO sql call
};