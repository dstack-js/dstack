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
You'll need a bootstrap/relay peers, we provide them by default, but we not guarantee availability.

### Create stack
```javascript
import { createStack } from '@dstack-js/lib'
const stack = createStack({ app: 'helloWorld' })
```
If you are using default peers be sure to set unique app name

```javascript
import { createStack } from '@dstack-js/lib'
const stack = createStack({ app: 'helloWorld', peers: ["https://peer.example.com/dstack"] })
```
If you want to use your own provide them in `peers` options key

### Store data
```javascript
await stack.node('sample.path.to.key', 'your value')
```

### Read data
```javascript
const {data} = await stack.node('sample.path.to.key')
```

### Observe data
```javascript
const {on} = await stack.node('sample.path.to.key')

on((data) => {
  console.log(data)
})
```

### Change data
```javascript
// Using node
await stack.node('sample.path.to.key', 'your new data')

// Using node instance
const {set} = await stack.node('sample.path.to.key')
await set('your new data')
```
