
ENV_FILE=.env
ENV_LOCAL_FILE=.env.local


.PHONY: help build run stop logs start buildd clean cleanall startd restartd

ascii: 
	@echo -e "--------"
	@echo -e "FRONTEND"
	@echo -e "--------"
                                                                  

start :
	docker compose --env-file $(ENV_FILE) --env-file $(ENV_LOCAL_FILE) up -d

logs : 
	docker compose logs -f

build: 
	docker compose --env-file $(ENV_FILE) --env-file $(ENV_LOCAL_FILE) up --build

buildd: 
	docker compose --env-file $(ENV_FILE) --env-file $(ENV_LOCAL_FILE) up --build -d

clean: 
	docker compose down

cleanall: 
	docker compose -v down

startd :
	$(MAKE) ascii
	$(MAKE) buildd
	$(MAKE) logs

restartd:
	$(MAKE) clean
	$(MAKE) buildd
	$(MAKE) logs




buildback :
	docker build --build-arg BACKEND_INT_PORT=$(BACKEND_INT_PORT) --build-arg ENVIRONMENT=$(ENVIRONMENT) -t ghcr.io/$(GHCR_LOCATION)/$(BACKEND_PACKAGE_NAME):v$(BACKEND_PACKAGE_VERSION) -f ./Dockerfile

runback :
	docker run --env-file .env --env-file .env.local -p $(BACKEND_EXT_PORT):$(BACKEND_INT_PORT) -d ghcr.io/$(GHCR_LOCATION)/$(BACKEND_PACKAGE_NAME):v$(BACKEND_PACKAGE_VERSION) 

pushback :
	docker push ghcr.io/$(GHCR_LOCATION)/$(BACKEND_PACKAGE_NAME):v$(BACKEND_PACKAGE_VERSION)


