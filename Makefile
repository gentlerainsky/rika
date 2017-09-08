GCR_SITE=asia.gcr.io/jitta-dev/
APP_NAME=columbus
APP_IMAGE_TAG=$(shell git log -n 1 --pretty=format:%h)
APP_IMAGE=$(GCR_SITE)$(APP_NAME):$(APP_IMAGE_TAG)
APP_IMAGE_PLAY=$(GCR_SITE)$(APP_NAME_PLAY):$(APP_IMAGE_TAG)

build:
	docker build -t $(APP_IMAGE) .

push:
	gcloud docker -- push $(APP_IMAGE)

replace:
	sed 's,<image_name>,$(APP_IMAGE),g' ./kubernetes/deployment.yaml | kubectl replace -f -

restart:
	kubectl delete pods -l name=$(APP_NAME)

deploy: build push replace
