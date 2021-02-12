NAME = recommender-function
REGISTRY = gcr.io/wolke-sieben-fs
VERSION = $(shell git describe --tags --dirty --always --long)

PROJECT_ROOT = $(shell pwd)

.PHONY: deploy

deploy:
	npm run build

	rm -rf deploy.tmp
	mkdir -p deploy.tmp

	cp -r build/*.js deploy.tmp
	cp package.json deploy.tmp
	cp .env.production deploy.tmp/.env

	gcloud functions deploy recommender-function --runtime nodejs14 --region europe-west3 --source deploy.tmp --entry-point recommend --trigger-topic newOffer
