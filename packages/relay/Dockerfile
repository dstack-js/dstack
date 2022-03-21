FROM node:lts

COPY package.json .
RUN yarn install --no-cache --silent

COPY . .

CMD ["node", "src/start.js"]
