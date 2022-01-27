all: decrypt build encrypt deploy

logs:
	heroku logs -d prometheus -a dstack-relay --tail

decrypt:
	../../node_modules/.bin/yaml-crypt prometheus.yml-crypt

encrypt:
	../../node_modules/.bin/yaml-crypt prometheus.yml

build:
	heroku container:push prometheus -a dstack-relay

deploy:
	heroku container:release prometheus -a dstack-relay
