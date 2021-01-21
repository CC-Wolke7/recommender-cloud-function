### Test locally

- Create the MySQL DB using the `database/testdump.sql`
- Change connection infos (host/user/pw) in `index.ts`
- Open three terminals and call
  - `gcloud beta emulators pubsub start` for starting the pubsub emulator
  - `npm start` to start the recommend function (using the google-cloud/functions-framework)
  - `curl -d "@message.json" -X POST -H "Content-Type: application/json" http://localhost:8080` to send a test message

### Use in cloud environment

#### Create view in MySQL DB

`` CREATE VIEW `race_user_list` AS SELECT race, GROUP_CONCAT(user_id) FROM subscription GROUP BY race ``

#### Create a Pub/Sub topic

`gcloud pubsub topics create <topic>`

#### Deploy recommend function and set trigger topic

`gcloud functions deploy MY_FUNCTION --trigger-topic <topic> --runtime nodejs10`

#### App Microservice publishes

`gcloud pubsub topics publish <topic> --message '{ "race": "golden_retriever" }'`
