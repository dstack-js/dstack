# Geohasing

Use geohasing for storing your data related to location

```javascript
import { encode } from '@dstack-js/geo'
```

Use precision to get zooming of your nodes

```javascript
encode(stack, stack.node('some.key.to.your.map'), lat, lng, precision)
```

## Example
```javascript
import { createStack, Stack } from '@dstack-js/lib'
import { encode } from '@dstack-js/geo'
const stack = await createStack({ app: 'mapExample' })

// Set places
const map = await stack.node('map')

const [p1, p2] = await Promise.all([
  encode(stack, map, 50.450_678, 30.522_395, 7),
  encode(stack, map, 50.440_239, 30.520_194, 7)
])

await p1.put({ title: 'Ukraine, Kyiv, Maydan' })
await p2.put({ title: 'Ukraine, Kyiv, Arena' })

p1.path === 'map.$geo.u.8.v.x.n.8.3'
p2.path === 'map.$geo.u.8.v.w.y.w.2'

const box = await encode(stack, map, 50.45, 30.52, 3)

// `box` will contain places that we set earlier
```
