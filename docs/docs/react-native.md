# React Native

## Dependencies
```bash
react-native install buffer text-encoding react-native-webview react-native-webview-bridge react-native-webview-crypto react-native-get-random-values @react-native-community/async-storage
```

Or using expo

```bash
expo install buffer text-encoding react-native-webview react-native-webview-bridge react-native-webview-crypto react-native-get-random-values @react-native-community/async-storage
```

## Initiate DStack lib
```javascript
import AsyncStorage from "@react-native-community/async-storage";
import SEA from 'gun/sea'
import 'gun/lib/radix.js'
import 'gun/lib/radisk.js'
import 'gun/lib/store.js'
import asyncStore from 'gun/lib/ras.js'
import { createStack } from '@dstack-js/lib'

// Warning: Android AsyncStorage has 6mb limit by default!
const stack = await createStack({
  name: 'RNDStack',
  gunOptions: {
    store: asyncStore({ AsyncStorage })
  }
})
```

DStack supports react-native out of the box this is the instructions for Gun.js to run inside react-native copied from [Gun.js docs](https://gun.eco/docs/React-Native).
