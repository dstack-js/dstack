FROM node:lts-alpine

ARG USER=relay
ENV HOME /home/$USER
RUN adduser -D $USER
RUN chown $USER $HOME
WORKDIR $HOME
USER $USER

COPY package.json .
COPY yarn.lock .
RUN yarn install --pure-lockfile --no-cache --silent

COPY . .

CMD ["node", "."]
