# @dstack-js/ipfs

This package was created specifically to use in [`@dstack-js/lib`](https://www.npmjs.com/package/@dstack-js/lib) package

[See tutorial to get started working with DStack](https://dstack.dev/docs/intro)

## Example

```javascript
import { create } from '@dstack-js/ipfs';

const ipfs = await create({ namespace: 'namespace' });
```

Node.js:

```javascript
import { create } from '@dstack-js/ipfs';
import wrtc from '@dstack-js/wrtc';

const ipfs = await create({ namespace: 'namespace', wrtc });
```
