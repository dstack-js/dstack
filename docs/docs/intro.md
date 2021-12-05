---
sidebar_position: 1
---

# Quick Look

Let's discover **DStack in less than 5 minutes**.

## Add DStack to your project

Using Yarn:
```shell
yarn add @dstack-js/lib
```

Using NPM:
```shell
npm i -S @dstack-js/lib
```

## Basic usage
You'll need a bootstrap/relay peers, we provide them by default.

### Create stack
```javascript
import { Stack } from '@dstack-js/lib'
const stack = new Stack({ app: 'helloWorld' })
```
If you are using default peers be sure to set unique app name

```javascript
import { Stack } from '@dstack-js/lib'
const stack = new Stack({ app: 'helloWorld', gun: { peers: ['https://localhost:1024/'] } })
```
If you want to use your own provide them in `gun.peers` option

```javascript
import { Stack, defaults } from '@dstack-js/lib'
const stack = new Stack({ app: 'helloWorld', gun: { peers: ['https://localhost:1024/', ...defaults.gun.peers] } })
```
If you want to use both your own, and DStack default peers provide them in `gun.peers` option and use `defaults.gun.peers`.

### Store data
```javascript
const node = stack.node('sample.path.to.key')
await node.set('Hey!')
await node.set({hello: 'world'})
```

### Read data
```javascript
const node = stack.node('sample.path.to.key')
const data = await node.get()
```

### Observe data
```javascript
const {on} = stack.node('sample.path.to.key')

on((data) => {
  console.log(data)
})
```
