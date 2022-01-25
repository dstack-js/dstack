#!/bin/bash
yarn build
cd dist/packages/relay
heroku container:push web -a dstack-relay
heroku container:release web -a dstack-relay
