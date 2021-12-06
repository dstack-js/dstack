FROM node:lts-alpine

RUN mkdir /relay
WORKDIR /relay

COPY package.json .
COPY yarn.lock .
RUN yarn install --silent
COPY src src
RUN yarn build

ENV NODE_ENV production

CMD node build/run.js
