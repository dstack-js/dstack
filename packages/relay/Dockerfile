FROM node:lts

ARG USER=relay
ENV HOME /home/$USER
RUN adduser --home $HOME $USER
RUN chown $USER $HOME
WORKDIR $HOME
USER $USER

COPY package.json .
COPY yarn.lock .
RUN yarn install --pure-lockfile --no-cache --silent

COPY . .

CMD ["node", "."]
