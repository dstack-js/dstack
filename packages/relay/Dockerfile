FROM node:lts

COPY package.json .
RUN yarn install --no-cache --silent

COPY . .

RUN ["node", "src/generate.js"]

ENV GENERATE=false
CMD ["node", "src/start.js"]
