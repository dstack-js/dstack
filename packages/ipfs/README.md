# @dstack-js/ipfs

This package was created to provide zero configuration ipfs for [`@dstack-js/lib`](https://www.npmjs.com/package/@dstack-js/lib) package

Instead you can use [ipfs-core](https://www.npmjs.com/package/ipfs-core) directly with DHT enabled

## Example
```javascript
import { create } from "@dstack-js/ipfs"

const ipfs = await create()
```
