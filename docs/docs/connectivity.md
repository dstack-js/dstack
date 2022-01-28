---
title: Connectivity
sidebar_position: 2
---

# Connectivity

No need to connect peers manually, DStack will handle it by itself

if you want to ensure that some peers is connected

### Connect to peer manually

```javascript
await stack.connect('/some/addr');
```

### Get connected Peers

```javascript
const peers = await stack.peers();
```
