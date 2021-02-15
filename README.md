# Recommender Cloud Function

[![Deployment](https://github.com/cc-wolke7/recommender-cloud-function/workflows/Deployment/badge.svg)](https://github.com/CC-Wolke7/recommender-cloud-function/actions?query=workflow%3ADeployment)

You can send a test event via:

```bash
curl -d "@mockPubSub.json" \
  -X POST \
  -H "Ce-Type: true" \
  -H "Ce-Specversion: true" \
  -H "Ce-Source: true" \
  -H "Ce-Id: true" \
  -H "Content-Type: application/json" \
  http://localhost:8080
```

The [`functions-framework-nodejs`]() project acknowledges that there are a [couple](https://github.com/GoogleCloudPlatform/functions-framework-nodejs/issues/41) of [issues](https://github.com/GoogleCloudPlatform/functions-framework-nodejs/issues/96) regarding the serialization of local test events. Be sure to test and adapt the payload format for production.

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

#### Steps:

1. `$ npm ci`
2. `$ npm run watch`

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
