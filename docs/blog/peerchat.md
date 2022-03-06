---
slug: peerchat
title: Peerchat
authors:
  - 0x77dev
tags: [dstack, example, demo, peerchat]
---

## Introduction

Peerchat is a CLI app that allows to chat via DStack PubSub API without any configuration

## Demo

[![asciicast](https://asciinema.org/a/465056.svg)](https://asciinema.org/a/465056)

## Try it out!

### Install

```console
$ npm i -g peerchat
```

```console
$ yarn global add peerchat
```

### Usage

```console
$ # peerchat [channel] [nickname]
$ peerchat dstack steve
```

## How it works?

DStack provides PubSub API

Peerchat uses it to communicate between users

### Code Examples

#### Listening to messages

```javascript
await stack.pubsub.subscribe(room, (event) => {
  const username = event.data.nickname
    ? `${event.data.nickname} (${event.from.slice(-5)})`
    : event.from.slice(-5);

  messageList.addItem(`${username}: ${event.data.message}`);
  messageList.scrollTo(100);
  screen.render();
});
```

#### Sending message

```javascript
await pubsub.publish(room, { nickname, message });
```

---

[Peerchat repository](https://github.com/dstack-js/chat)

## Get started with DStack

See [Tutorial](/docs/intro) to get started using DStack in your app
