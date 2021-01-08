#### Create view in MySQL DB
``CREATE VIEW `race_user_list` AS SELECT race, GROUP_CONCAT(user_id) FROM subscription GROUP BY race``

#### Create a Pub/Sub topic
`gcloud pubsub topics create <topic>`

#### Deploy recommend function and set trigger topic
`gcloud functions deploy MY_FUNCTION --trigger-topic <topic> --runtime nodejs10`

#### App Microservice publishes
`gcloud pubsub topics publish <topic> --message '{ "race": "golden_retriever" }'`