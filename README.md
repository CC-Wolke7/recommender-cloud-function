# Recommender Cloud Function

You can send a test message via: `$ curl -d "@message.json" -X POST -H "Content-Type: application/json" http://localhost:8080`

## Development

### Docker

Development can be done in Docker without any external dependencies using [docker-compose](https://docs.docker.com/compose/reference/overview/).

For the first time running, you can bootstrap the local development environment with `bin/bootstrap.sh`.

After that, you can manage the environment with standard [docker-compose](https://docs.docker.com/compose/reference/overview/) commands. A few of the more common commands are listed below.

| Action                | Command                    |
| --------------------- | -------------------------- |
| Bootstrap environment | `$ bin/bootstrap.sh`       |
| Start environment     | `$ docker-compose start`   |
| Stop environment      | `$ docker-compose stop`    |
| Attach to logs        | `$ docker-compose logs -f` |
| Destroy environment   | `$ docker-compose down -v` |

---

### Native

If you prefer not to develop with Docker, you can run the app natively on your system.

#### Dependencies:

- [NodeJS 14.15+](https://www.python.org/)
- MySQL
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstart?hl=de)

#### Steps:

1. Setup the database

- Create the MySQL DB using the `database/testdump.sql`
- Update the DB connection infos in `index.ts`

1. Emulate Google PubSub via: `$ gcloud beta emulators pubsub start`
2. `$ npm ci`
3. `$ npm run watch`

## Deployment

This project includes a GitHub workflow for deployment to Google Cloud Functions. To do so, perform the following steps:

1. Create a new service account (SA) via: IAM & Admin > Service Accounts > Create Service Account

2. Grant permissions via IAM & Admin > IAM > Permissions > Edit SA (from above) > Add another role

- Service Account User
- Cloud Functions Admin

3. Generate a service account key via IAM & Admin > Service Accounts > Actions > Create key > type: JSON

4. Add GitHub secrets

- `GCP_PROJECT_ID: <your-project>`
- `GCP_SA_KEY: <JSON-contents-from-above>`

5. Enable the [Google Cloud Functions API](http://console.cloud.google.com/apis/library/cloudfunctions.googleapis.com)

6. Deploy via GitHub Actions

<!-- ## Use in cloud environment

#### Create view in MySQL DB

`` CREATE VIEW `race_user_list` AS SELECT race, GROUP_CONCAT(user_id) FROM subscription GROUP BY race ``

#### Create a Pub/Sub topic

`gcloud pubsub topics create <topic>`

#### Deploy recommend function and set trigger topic

`gcloud functions deploy MY_FUNCTION --trigger-topic <topic> --runtime nodejs10`

#### App Microservice publishes

`gcloud pubsub topics publish <topic> --message '{ "race": "golden_retriever" }'` -->
