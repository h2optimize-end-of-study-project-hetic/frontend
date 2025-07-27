ENV_FILE=.env
ENV_LOCAL_FILE=.env.local

ifneq ("$(wildcard .env)","")
        include .env
        export $(shell sed 's/=.*//' .env)
endif

ifneq ("$(wildcard .env.local)","")
        include .env.local
        export $(shell sed 's/=.*//' .env.local)
endif

.PHONY: ascii build logs start buildd clean cleanall startd restartd

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
